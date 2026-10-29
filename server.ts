import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { GoogleGenAI } from '@google/genai';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '20mb' }));

// Initialize GoogleGenAI client on server
const geminiApiKey = process.env.GEMINI_API_KEY;
let geminiClient: GoogleGenAI | null = null;

if (geminiApiKey && geminiApiKey !== 'MY_GEMINI_API_KEY') {
  try {
    geminiClient = new GoogleGenAI({
      apiKey: geminiApiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  } catch (err) {
    console.error('Failed to initialize GoogleGenAI client:', err);
  }
}

// -------------------------------------------------------------
// 1. Model Health Check Endpoint
// -------------------------------------------------------------
app.get('/api/ai/health', async (req, res) => {
  const mode = (req.query.mode as string) || 'gemini_server';
  const ollamaUrl = (req.query.ollamaUrl as string) || 'http://localhost:11434';
  const ollamaModel = (req.query.ollamaModel as string) || 'gemma2:9b';

  const startTime = Date.now();

  if (mode === 'ollama_local') {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2500);

      const resp = await fetch(`${ollamaUrl}/api/tags`, {
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (resp.ok) {
        const data = (await resp.json()) as { models?: Array<{ name: string }> };
        const latencyMs = Date.now() - startTime;
        const availableModels = data.models?.map((m) => m.name) || [];
        const hasModel = availableModels.some((m) =>
          m.toLowerCase().includes(ollamaModel.toLowerCase().split(':')[0])
        );

        return res.json({
          status: 'connected',
          provider: 'Local Ollama Runtime',
          model: ollamaModel,
          license: ollamaModel.includes('gemma')
            ? 'Gemma Open License'
            : ollamaModel.includes('qwen')
            ? 'Apache 2.0'
            : 'Open-Weight Community License',
          isLocal: true,
          isOfflineCapable: true,
          latencyMs,
          details: hasModel
            ? `Verified connected to local Ollama. Model '${ollamaModel}' is loaded and ready for private, offline inference.`
            : `Ollama connected, but '${ollamaModel}' not found in local library. Available: ${
                availableModels.join(', ') || 'none'
              }. Run 'ollama pull ${ollamaModel}'.`,
          verifiedAt: new Date().toISOString(),
        });
      }
    } catch (e: any) {
      return res.json({
        status: 'error',
        provider: 'Local Ollama (Unreachable)',
        model: ollamaModel,
        license: 'N/A',
        isLocal: true,
        isOfflineCapable: true,
        details: `Cannot connect to Ollama at ${ollamaUrl}. Ensure Ollama is running ('ollama serve') with OLLAMA_ORIGINS="*" if testing cross-origin.`,
        verifiedAt: new Date().toISOString(),
      });
    }
  }

  // Gemini server-side adapter check
  if (geminiClient) {
    return res.json({
      status: 'fallback_ready',
      provider: 'Gemini Server Adapter (Host Inference)',
      model: 'gemini-3.8-flash',
      license: 'Google Cloud GenAI API (Developer Proxy)',
      isLocal: false,
      isOfflineCapable: false,
      latencyMs: Date.now() - startTime,
      details:
        'Active server-side AI connection ready. When running locally with Ollama, you can switch to 100% private offline inference in the AI Laboratory.',
      verifiedAt: new Date().toISOString(),
    });
  }

  // Search-only fallback
  return res.json({
    status: 'offline_search',
    provider: 'Archival Lexical Search Engine',
    model: 'Full-Text Document Ranker',
    license: 'MIT (Built-in Client/Server)',
    isLocal: true,
    isOfflineCapable: true,
    latencyMs: Date.now() - startTime,
    details:
      'Operating in deterministic archive search mode. Text passages and documented citations are extracted directly without generative hallucinations.',
    verifiedAt: new Date().toISOString(),
  });
});

// -------------------------------------------------------------
// 2. RAG Interrogation / Ask the Archive Endpoint
// -------------------------------------------------------------
app.post('/api/ai/ask', async (req, res) => {
  try {
    const { query, memories, modelConfig } = req.body;

    if (!query || typeof query !== 'string' || !query.trim()) {
      return res.status(400).json({ error: 'Query is required.' });
    }

    if (!memories || !Array.isArray(memories) || memories.length === 0) {
      return res.json({
        answer: 'The archive contains no records to examine. Please add or restore memories.',
        hasSufficientData: false,
        documentedFacts: [],
        interpretations: [],
        sources: [],
        isInferenceLocal: true,
        modelUsed: 'Archival Empty State Guard',
        inferenceMode: 'None',
      });
    }

    // Step A: Full-Text Retrieval & Passage Extraction
    const queryTerms = query
      .toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter((term: string) => term.length > 2);

    const scoredMemories = memories
      .map((item) => {
        let score = 0;
        const textToSearch = [
          item.title,
          item.description,
          item.content,
          item.author,
          item.recipient || '',
          item.location || '',
          ...(item.tags || []),
          item.date,
        ]
          .join(' ')
          .toLowerCase();

        queryTerms.forEach((term: string) => {
          if (textToSearch.includes(term)) {
            // Title and author matches score higher
            if (item.title.toLowerCase().includes(term)) score += 5;
            if (item.author.toLowerCase().includes(term)) score += 4;
            if (item.tags?.some((t: string) => t.toLowerCase().includes(term))) score += 3;
            // Frequency in content
            const matches = (textToSearch.match(new RegExp(term, 'g')) || []).length;
            score += Math.min(matches, 6);
          }
        });

        // Extract context passages
        const sentences = (item.content || '').split(/(?<=[.!?])\s+/);
        const relevantSentences = sentences.filter((s: string) =>
          queryTerms.some((t: string) => s.toLowerCase().includes(t))
        );

        const excerpt =
          relevantSentences.slice(0, 3).join(' ') ||
          (sentences.slice(0, 2).join(' ') || item.description);

        return { item, score, excerpt };
      })
      .filter((entry) => entry.score > 0)
      .sort((a, b) => b.score - a.score);

    // If no records match query terms at all
    if (scoredMemories.length === 0) {
      return res.json({
        answer: 'The archive does not contain enough information to answer that.',
        hasSufficientData: false,
        documentedFacts: [],
        interpretations: [],
        sources: [],
        isInferenceLocal: modelConfig?.mode === 'ollama_local',
        modelUsed: 'Grounded Archive Retrieval',
        inferenceMode: modelConfig?.mode || 'fallback',
      });
    }

    // Top 3 relevant source documents
    const topSources = scoredMemories.slice(0, 3);
    const sourceContext = topSources
      .map(
        (s, idx) => `[Source ${idx + 1}]
Accession: ${s.item.accessionNumber}
Title: "${s.item.title}"
Date: ${s.item.date}
Author: ${s.item.author}
Category: ${s.item.category}
Location: ${s.item.location || 'Unknown'}
Content Excerpt:
${s.item.content}
`
      )
      .join('\n\n---\n\n');

    const sourcesPayload = topSources.map((s) => ({
      id: s.item.id,
      accessionNumber: s.item.accessionNumber,
      title: s.item.title,
      date: s.item.date,
      category: s.item.category,
      excerpt: s.excerpt,
    }));

    // Step B: Attempt Generation (Ollama local OR Gemini server fallback)
    const promptInstructions = `You are the Archival Record Keeper of "GHOST IN THE ARCHIVE".
Your duty is strictly historical, curatorial, and archival.

ARCHIVE RECORD PASSAGES:
${sourceContext}

USER'S INQUIRY:
"${query}"

MANDATORY LAWS:
1. Ground your answer EXCLUSIVELY in the provided passages above.
2. If the passages do not provide enough verified information to answer the question, you MUST return:
   "The archive does not contain enough information to answer that."
3. Distinguish DOCUMENTED FACTS (verifiable statements recorded in the text) from INTERPRETATIONS (historical inference).
4. Cite the title of the source whenever mentioning a statement.
5. NEVER invent dates, people, events, quotations, or relationships not in the text.
6. NEVER claim supernatural contact, spiritual communion, or mediumship. Ghost Mode is creative writing, but this inquiry must remain purely factual.

Respond strictly in valid JSON with this structure:
{
  "answer": "Clear, atmospheric yet precise answer grounded in the sources.",
  "hasSufficientData": true,
  "documentedFacts": ["Exact fact 1 (Source Title)", "Exact fact 2 (Source Title)"],
  "interpretations": ["Cautious curatorial observation if appropriate, or empty array"],
  "citedTitles": ["Source Title 1"]
}`;

    // 1. Ollama local check
    if (modelConfig?.mode === 'ollama_local') {
      try {
        const ollamaRes = await fetch(`${modelConfig.ollamaUrl || 'http://localhost:11434'}/api/chat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: modelConfig.ollamaModel || 'gemma2:9b',
            messages: [{ role: 'user', content: promptInstructions }],
            stream: false,
            format: 'json',
          }),
        });

        if (ollamaRes.ok) {
          const ollamaData = (await ollamaRes.json()) as { message?: { content: string } };
          const parsed = JSON.parse(ollamaData.message?.content || '{}');
          return res.json({
            answer: parsed.answer || 'Answer generated from local Ollama model.',
            hasSufficientData: parsed.hasSufficientData !== false,
            documentedFacts: parsed.documentedFacts || [],
            interpretations: parsed.interpretations || [],
            sources: sourcesPayload,
            isInferenceLocal: true,
            modelUsed: `${modelConfig.ollamaModel} (Local Ollama)`,
            inferenceMode: 'Local Open-Weight',
          });
        }
      } catch (err) {
        console.warn('Ollama call failed, will try server fallback if available', err);
      }
    }

    // 2. Gemini server-side call
    if (geminiClient) {
      try {
        const geminiResponse = await geminiClient.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: promptInstructions,
          config: {
            responseMimeType: 'application/json',
            temperature: 0.2, // low temperature for high grounding fidelity
          },
        });

        const rawText = geminiResponse.text?.trim() || '{}';
        const parsed = JSON.parse(rawText);

        return res.json({
          answer: parsed.answer || 'Answer retrieved from archival records.',
          hasSufficientData: parsed.hasSufficientData !== false,
          documentedFacts: parsed.documentedFacts || [],
          interpretations: parsed.interpretations || [],
          sources: sourcesPayload,
          isInferenceLocal: false,
          modelUsed: 'Gemini 3.8 Flash (Server Adapter)',
          inferenceMode: 'Hosted Inference',
        });
      } catch (geminiErr) {
        console.error('Gemini server call failed:', geminiErr);
      }
    }

    // 3. Deterministic Search-Only Fallback (Zero hallucinations)
    const top = topSources[0];
    const facts = topSources.map(
      (s) => `Recorded in "${s.item.title}" (${s.item.date}): ${s.excerpt}`
    );

    return res.json({
      answer: `According to the archival records in "${top.item.title}" (${top.item.date}), the documents record: "${top.excerpt}".`,
      hasSufficientData: true,
      documentedFacts: facts,
      interpretations: [
        'Curatorial note: Retrieved via deterministic lexical search. Connect a model in the AI Laboratory for synthesized prose.',
      ],
      sources: sourcesPayload,
      isInferenceLocal: true,
      modelUsed: 'Archival Lexical Search (Deterministic)',
      inferenceMode: 'Search-Only Mode',
    });
  } catch (error: any) {
    console.error('Error in /api/ai/ask:', error);
    res.status(500).json({ error: 'Failed to process inquiry.', details: error.message });
  }
});

// -------------------------------------------------------------
// 3. Ghost Mode: The Story Chamber Endpoint
// -------------------------------------------------------------
app.post('/api/ai/story', async (req, res) => {
  try {
    const {
      memoryIds,
      memories,
      style = 'Gothic Mystery',
      length = 'Medium',
      intensity = 'Eerie',
      grounding = 'Inspired by Sources',
      customPrompt = '',
      modelConfig,
    } = req.body;

    const selectedMemories = (memories || []).filter((m: any) =>
      (memoryIds || []).includes(m.id)
    );

    if (selectedMemories.length === 0) {
      return res.status(400).json({ error: 'Please select at least one memory to inspire the story.' });
    }

    const memoryContext = selectedMemories
      .map(
        (m: any) => `DOCUMENT [${m.accessionNumber}]
Title: "${m.title}"
Date: ${m.date}
Author: ${m.author}
Category: ${m.category}
Full Text / Archival Excerpt:
${m.content}
`
      )
      .join('\n\n---\n\n');

    const promptInstructions = `You are a master of atmospheric gothic literature writing for "GHOST IN THE ARCHIVE: THE STORY CHAMBER".

CORE SPECIFICATIONS:
- Fiction Type: ${style}
- Target Length: ${length} (Short = ~250 words, Medium = ~500 words, Long = ~800 words)
- Atmospheric Intensity: ${intensity} (Eerie = spine-chilling gothic dread, Mysterious = enigmatic shadows and puzzles, Gentle = melancholic, wistful, tender)
- Grounding: ${grounding} (${
      grounding === 'Inspired by Sources'
        ? 'Weave details, names, locations, and artifacts from the source documents directly into the fictional narrative.'
        : 'Use the source documents solely as an atmospheric launching point, inventing a completely original fiction.'
    })
${customPrompt ? `Additional Writer Direction: ${customPrompt}` : ''}

INSPIRING SOURCE ARCHIVE RECORDS:
${memoryContext}

CRITICAL ETHICAL & LITERARY RULES:
1. THIS MUST BE AN ORIGINAL FICTIONAL STORY. Label it clearly as fiction.
2. DO NOT pretend to channel, speak for, or communicate with real deceased human beings. If writing in Gentle Remembrance, maintain respectful literary distance.
3. Evoke dark gothic beauty: candlelit studies, salt-scoured cliffs, ticking pocket watches, dust motes in moonlight, frost on leaded glass, antique paper scents.
4. Craft a memorable title for the story.

Respond strictly in valid JSON:
{
  "title": "Title of the Story",
  "story": "The full text of the story with atmospheric paragraph breaks.",
  "inspiredMemoryTitles": ${JSON.stringify(selectedMemories.map((m: any) => m.title))},
  "readTimeMinutes": 3
}`;

    // 1. Ollama local
    if (modelConfig?.mode === 'ollama_local') {
      try {
        const ollamaRes = await fetch(`${modelConfig.ollamaUrl || 'http://localhost:11434'}/api/chat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: modelConfig.ollamaModel || 'gemma2:9b',
            messages: [{ role: 'user', content: promptInstructions }],
            stream: false,
            format: 'json',
          }),
        });

        if (ollamaRes.ok) {
          const ollamaData = (await ollamaRes.json()) as { message?: { content: string } };
          const parsed = JSON.parse(ollamaData.message?.content || '{}');
          return res.json({
            id: `story-${Date.now()}`,
            title: parsed.title || 'Echoes from the Vault',
            story: parsed.story,
            style,
            length,
            intensity,
            grounding,
            inspiredMemoryIds: selectedMemories.map((m: any) => m.id),
            inspiredMemoryTitles: selectedMemories.map((m: any) => m.title),
            createdAt: new Date().toISOString(),
            isFiction: true,
            modelUsed: `${modelConfig.ollamaModel} (Local Ollama)`,
            readTimeMinutes: parsed.readTimeMinutes || 3,
          });
        }
      } catch (err) {
        console.warn('Ollama story generation failed, falling back:', err);
      }
    }

    // 2. Gemini server-side
    if (geminiClient) {
      try {
        const geminiResponse = await geminiClient.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: promptInstructions,
          config: {
            responseMimeType: 'application/json',
            temperature: 0.85, // creative temperature for storytelling
          },
        });

        const rawText = geminiResponse.text?.trim() || '{}';
        const parsed = JSON.parse(rawText);

        return res.json({
          id: `story-${Date.now()}`,
          title: parsed.title || 'Whispers in the Stacks',
          story: parsed.story,
          style,
          length,
          intensity,
          grounding,
          inspiredMemoryIds: selectedMemories.map((m: any) => m.id),
          inspiredMemoryTitles: selectedMemories.map((m: any) => m.title),
          createdAt: new Date().toISOString(),
          isFiction: true,
          modelUsed: 'Gemini 3.8 Flash (Server Adapter)',
          readTimeMinutes: parsed.readTimeMinutes || 3,
        });
      } catch (geminiErr) {
        console.error('Gemini story generation failed:', geminiErr);
      }
    }

    // 3. Fallback Gothic Narrative
    const primary = selectedMemories[0];
    const fallbackStory = `The archive was quiet at twilight, save for the dry rustle of parchment turning in the draft from the courtyard.

In the records of "${primary.title}", dated ${primary.date}, a truth had long remained dormant: "${primary.description}". 

It is said that whoever reads the lines written by ${primary.author} under the amber flicker of tallow candles begins to perceive the room differently. Shadows lengthen along the mahogany shelves. The floorboards settle with the slow, rhythmic cadence of footsteps pacing the gallery above. Outside the leaded windows, the autumn mist curls into silhouettes against the glass, lingering like unspoken words across the years.

No spirit speaks; only the weight of time, preserved in faded ink upon rag paper, asserting that some memories refuse to decay into silence.`;

    return res.json({
      id: `story-${Date.now()}`,
      title: `The Shadow of ${primary.title.split(':')[0]}`,
      story: fallbackStory,
      style,
      length,
      intensity,
      grounding,
      inspiredMemoryIds: selectedMemories.map((m: any) => m.id),
      inspiredMemoryTitles: selectedMemories.map((m: any) => m.title),
      createdAt: new Date().toISOString(),
      isFiction: true,
      modelUsed: 'Ghost Engine (Archival Fallback Synthesis)',
      readTimeMinutes: 2,
    });
  } catch (error: any) {
    console.error('Error in /api/ai/story:', error);
    res.status(500).json({ error: 'Failed to generate story.', details: error.message });
  }
});

// -------------------------------------------------------------
// 4. Document / File Extraction Endpoint
// -------------------------------------------------------------
app.post('/api/extract-text', async (req, res) => {
  try {
    const { fileName, fileType, textContent, base64Data } = req.body;

    if (!fileName) {
      return res.status(400).json({ error: 'File name is required.' });
    }

    // Plain text or Markdown
    if (fileType?.includes('text') || fileName.endsWith('.txt') || fileName.endsWith('.md')) {
      return res.json({
        success: true,
        extractedText: textContent || '',
        fileName,
        fileType,
        method: 'Native Text Parser',
      });
    }

    // Image OCR via Gemini if available
    if (fileType?.startsWith('image/') && base64Data && geminiClient) {
      try {
        const mimeType = fileType || 'image/jpeg';
        const cleanBase64 = base64Data.replace(/^data:image\/[a-z]+;base64,/, '');

        const response = await geminiClient.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: {
            parts: [
              {
                inlineData: {
                  data: cleanBase64,
                  mimeType,
                },
              },
              {
                text: 'Carefully transcribe all readable text from this historical document or photograph. If handwritten cursive, transcribe faithfully with line breaks. Also provide a 1-sentence archival description of the visual scene.',
              },
            ],
          },
        });

        return res.json({
          success: true,
          extractedText: response.text || '',
          fileName,
          fileType,
          method: 'Vision Optical Character Recognition (OCR)',
        });
      } catch (ocrErr) {
        console.warn('OCR extraction failed:', ocrErr);
      }
    }

    // Default response for PDF or unsupported binary
    return res.json({
      success: true,
      extractedText: textContent || `[Archival record attached: ${fileName} (${fileType || 'binary'})]`,
      fileName,
      fileType,
      method: 'Archival File Register',
      note: 'Binary content registered. For OCR extraction, plain text or images can be processed directly.',
    });
  } catch (error: any) {
    res.status(500).json({ error: 'Text extraction failed.', details: error.message });
  }
});

// -------------------------------------------------------------
// Vite Dev Server / Production Serving
// -------------------------------------------------------------
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`Ghost in the Archive server listening on port ${PORT}`);
  });
}

startServer();

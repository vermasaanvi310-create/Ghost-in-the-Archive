import { MemoryItem, StoryRecord } from '../types/archive';

export const SAMPLE_MEMORIES: MemoryItem[] = [
  {
    id: 'mem-1912-letter',
    accessionNumber: 'ACC-1912-0084',
    title: 'Letter from London to Eleanor at Blackwood',
    date: 'October 14, 1912',
    year: 1912,
    category: 'Letters',
    author: 'Arthur Pendelton',
    recipient: 'Eleanor Pendelton',
    location: 'Kensington Study, London',
    description: 'A delicate handwritten letter with burgundy wax seal recounting coastal walks, the turning autumn weather, and concerns regarding father\'s health.',
    content: `London, October 14th, 1912.

My Dearest Eleanor,

It seems an age since last we met. I am writing from the study, amidst a stack of books and memories of our lovely days at the coast. The weather is turning chilly here, and the autumn winds howl outside the leaded casements like an impatient guest.

I often recall our walk along the chalk cliffs and the scent of the brine. Tell Father that the specialist in Harley Street recommends rest and warmth through the winter months. Do not let him wander down to the library after midnight when the coal stove dies down; the draughts there are perilous.

I have located the second volume of the maritime charts he requested from the antiquarian in Holborn. I shall bring it when I take the Friday night sleeper to Sussex.

Do tell Father I shall visit soon with my deepest affection.

Yours with affection,
Arthur`,
    tags: ['Correspondence', 'London', 'Autumn', 'Family', 'Blackwood Manor'],
    imageUrl: '/src/assets/images/vintage_letter_manuscript_1793283335113.jpg',
    imageAlt: 'Vintage 1912 handwritten letter on aged parchment with burgundy wax seal',
    originalFileName: 'arthur_letter_oct_1912.txt',
    fileType: 'text/plain',
    createdDate: '1912-10-14',
    isDemo: true
  },
  {
    id: 'mem-1888-journal',
    accessionNumber: 'ACC-1888-0112',
    title: 'The Winter Solstice Log, Oakhaven Lighthouse',
    date: 'December 21, 1888',
    year: 1888,
    category: 'Journals',
    author: 'Silas Vance (Assistant Keeper)',
    location: 'Oakhaven Point Lightstation',
    description: 'A frost-damaged ledger recording bitter blizzards, a winter celebration held by two keepers, and an inexplicable ringing of the fog bell in calm seas.',
    content: `December 21st, 1888 — Winter Solstice.

Barometer 28.4. Gale force winds out of the north-northwest. Sea spray freezing against the third gallery windows into sheets of translucent ice.

Keeper MacIntyre and I held a modest winter celebration tonight at the stove. We shared a tin of preserved peaches and a ration of rum, speaking of our families in Devon. We lit three tallow candles in honour of the shortest day, watching the lantern clock tick toward midnight.

At 02:40, the wind died entirely. In the absolute dead calm, the bronze fog bell struck three distinct tones across the headland. Neither MacIntyre nor I had touched the lanyards. When I climbed the iron spiral stair to inspect the mechanism, the hammer was resting motionless in its cradle. No ships sighted in the channel.

The wick is trimmed; the kerosene reservoir remains half full. I remain watchful until dawn.

Silas Vance, Assistant Keeper.`,
    tags: ['Maritime', 'Lighthouse', 'Winter Solstice', 'Solitary', 'Phenomenon'],
    originalFileName: 'oakhaven_log_1888.md',
    fileType: 'text/markdown',
    createdDate: '1888-12-21',
    isDemo: true
  },
  {
    id: 'mem-1845-folklore',
    accessionNumber: 'ACC-1845-0019',
    title: 'County Record: The Whispering Mill of Oakhaven Vale',
    date: 'September 3, 1845',
    year: 1845,
    category: 'Folklore',
    author: 'Reverend Tobias Wright',
    location: 'Oakhaven Vale Parish, Yorkshire',
    description: 'An ecclesiastical survey documenting the abandonment of the Old Mill on the River Wyre and local folklore of ghostly millstones turning beneath moonlight.',
    content: `Extract from the Parish Survey of Oakhaven Vale, Anno Domini 1845.

Concerning the Old Grain Mill upon the lower reaches of the River Wyre:

The structure hath lain desolate since the Great November Spate of 1832, wherein the miller, Master George Harrow, perished attempting to raise the flood sluices. The timber race is broken, and willow saplings now grow between the millstones.

Nevertheless, it is firmly affirmed by the shepherds and night-carters that on moonlit evenings when the river mist rises, a low rumbling sound resembles the turning of heavy buhrstones. The villagers term this "The Miller's Ledger." Several parish elders claim to have observed a lantern flickering through the collapsed upper floor.

I have admonished the young folk against congregating near the millpond after dusk, both for the peril of rotting floorboards and the idle propagation of superstitions.

 Tobias Wright, Curate.`,
    tags: ['Folklore', 'River Wyre', 'Parish Records', 'Superstition', 'Yorkshire'],
    originalFileName: 'parish_survey_1845.txt',
    fileType: 'text/plain',
    createdDate: '1845-09-03',
    isDemo: true
  },
  {
    id: 'mem-1904-photo',
    accessionNumber: 'ACC-1904-0042',
    title: 'Daguerreotype Record: The Solitary Manor at Willow Reach',
    date: 'November 18, 1904',
    year: 1904,
    category: 'Photographs',
    author: 'Archival Collection of Edgar Croft',
    location: 'Willow Reach, River Avon',
    description: 'Silver plate daguerreotype photograph capturing an isolated Victorian stone manor wrapped in river mist and bare willows.',
    content: `Archival Catalog Note — Plate #42:

Recovered from the Croft family estate in Wiltshire. Silver gelatine negative preserved in tarnished brass filigree case.

The photograph depicts the manor house at Willow Reach during the late autumn of 1904. The house was erected in 1860 by industrialist Alistair Vance, but remained unoccupied for long intervals following his disappearance during an expedition to the Hebrides in 1891.

Noticeable silver tarnish along the plate perimeter. On the reverse side, an inscription in faded pencil reads: "Taken on the morning the last boat departed. The river has taken the path."`,
    tags: ['Daguerreotype', 'Victorian Architecture', 'River Avon', 'Wiltshire'],
    imageUrl: '/src/assets/images/vintage_daguerreotype_photo_1793283336545.jpg',
    imageAlt: 'Victorian daguerreotype photograph of a solitary stone manor shrouded in river mist',
    originalFileName: 'daguerreotype_plate_42.jpg',
    fileType: 'image/jpeg',
    createdDate: '1904-11-18',
    isDemo: true
  },
  {
    id: 'mem-1934-family',
    accessionNumber: 'ACC-1934-0067',
    title: 'Oral History: Clara and the Clockmaker\'s Locket',
    date: 'April 19, 1934',
    year: 1934,
    category: 'Family Stories',
    author: 'Clara Pendelton-Vance',
    location: 'Bath, Somerset',
    description: 'An intimate family memoir concerning a grandfather\'s brass mechanical locket that inexplicably seized at 4:17 on the afternoon of his passing.',
    content: `Recorded in Bath, Somerset, 1934:

"Grandfather Julian was a watchmaker by trade, trained under Dent in London. He wore a heavy brass pocket locket containing miniature portraits of his twin sisters, who both died of the influenza during the cold winter of 1874.

The escapement inside was unique — Julian had carved twenty-four micro-gears by hand so the second hand swept in a silent, fluid arc rather than ticking.

On the afternoon he died, April 19th, 1934, Mother was sitting at his bedside. At precisely seventeen minutes past four o'clock, the locket upon his nightstand produced a soft chime like a silver pin dropping on glass. When Mother picked it up, the fluid movement had seized completely.

Three separate horologists in Bristol examined the mechanism over the ensuing years. Not one could find a broken spring, nor a speck of grit. Yet none could coax the gears to turn again. Mother kept it in her jewelry chest wrapped in black silk."`,
    tags: ['Oral History', 'Clockmaker', 'Family Heirloom', 'Bath', 'Somerset'],
    originalFileName: 'clara_memoir_1934.txt',
    fileType: 'text/plain',
    createdDate: '1934-04-19',
    isDemo: true
  }
];

export const SAMPLE_GHOST_STORY: StoryRecord = {
  id: 'story-demo-01',
  title: 'The Solitary Bell of Oakhaven Point',
  story: `The fog arrived not as vapor, but as a silent tenant moving room to room along the salt-scoured gallery.

Silas Vance checked the iron regulator on the wall for the third time before midnight. The kerosene lamp cast long, amber shadows that trembled across the brass rim of his barometer. Beyond the glass, where the Atlantic usually broke against the jagged teeth of Oakhaven Head, there was only absolute blackness—a void so complete that the beacon seemed to swallow its own light.

Keeper MacIntyre had retired to his bunk after their meager solstice meal, leaving Silas to listen to the settling timbers of the tower. In the quiet, the isolation felt physical, pressing against the leaded panes like cold hands.

Then, at precisely forty minutes past two, the headland fell unnaturally quiet. The gale that had rattled the stove pipe ceased as if cut with a blade.

Out upon the frozen rocks, twenty feet below the keeper's gallery, the bronze fog bell swung once.

*Clang.*

Silas froze, his quill dripping sepia ink upon the open ledger.

*Clang.*

He knew every link of the counterweighted chain. He had greased the axle himself at sundown; without three stone of tension pulled from the winch room, the clapper could not touch the rim.

*Clang.*

Lighting the storm lantern, Silas wound his wool scarf tight and pushed through the heavy oak door onto the iron walkway. The salt air stung his eyes. Below him, the fog parted for an instant in the wash of the revolving lamp.

There was no ship upon the reef. No keeper pulled the hemp lanyard. But in the wet sand at the base of the gallows frame, beside the stationary bronze bell, two sets of boot prints led straight out of the surging surf—and ended at the iron threshold of his own tower door.`,
  style: 'Victorian Ghost Story',
  length: 'Medium',
  intensity: 'Eerie',
  grounding: 'Inspired by Sources',
  inspiredMemoryIds: ['mem-1888-journal', 'mem-1904-photo'],
  inspiredMemoryTitles: [
    'The Winter Solstice Log, Oakhaven Lighthouse',
    'Daguerreotype Record: The Solitary Manor at Willow Reach'
  ],
  createdAt: '2026-10-29',
  isFiction: true,
  modelUsed: 'Gemma 2 9B (Open Weights via Ghost Adapter)',
  readTimeMinutes: 3
};

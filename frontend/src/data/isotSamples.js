/**
 * isotSamples.js
 * Authoritative sample articles extracted directly from the original ISOT Fake News Dataset.
 * Source files: True.csv and Fake.csv.
 *
 * Labels:
 *   - Real News = 1 (Extracted from True.csv)
 *   - Fake News = 0 (Extracted from Fake.csv)
 *
 * Collection: 2 Real Short + 1 Real Long + 2 Fake Short + 1 Fake Long = 6 samples total.
 *
 * Token Count Enforcement:
 *   Every sample contains a MAXIMUM of 256 tokens validated with the exact fine-tuned
 *   RoBERTa tokenizer (roberta_no_reuters) including special tokens (<s>, </s>).
 *   - Short samples: ~58–66 tokens
 *   - Long samples: ~248–251 tokens (close to the 256 limit without exceeding it)
 *
 * Note: For articles whose full text exceeds 256 tokens, a contiguous excerpt from the
 * beginning ending at a natural sentence boundary is preserved verbatim without rewriting.
 */

export const ISOT_SAMPLES = [
  // ── 2 Genuine Real News Articles — SHORT (True.csv, Label: 1) ──

  {
    id: 'isot-real-short-1',
    category: 'real',
    length: 'short',
    tokenCount: 60,
    labelNumber: 1,
    sourceDataset: 'ISOT True.csv',
    subject: 'politicsNews',
    date: 'May 16, 2017',
    title: 'McConnell: Border tax would likely not pass U.S. Senate – Bloomberg TV',
    preview:
      'WASHINGTON (Reuters) - Any tax reform plan that includes a border adjustment tax would likely not pass the U.S. Senate, its Republican Majority Leader, Mitch McConnell, said in an interview...',
    text:
      'WASHINGTON (Reuters) - Any tax reform plan that includes a border adjustment tax would likely not pass the U.S. Senate, its Republican Majority Leader, Mitch McConnell, said in an interview with Bloomberg Television on Tuesday. McConnell added that any tax plan would also have to be revenue neutral.',
  },

  {
    id: 'isot-real-short-2',
    category: 'real',
    length: 'short',
    tokenCount: 58,
    labelNumber: 1,
    sourceDataset: 'ISOT True.csv',
    subject: 'politicsNews',
    date: 'March 7, 2017',
    title: "Iraq's al-Abadi to visit Trump later in March",
    preview:
      "WASHINGTON (Reuters) - Iraq's Prime Minister Haider al-Abadi will visit President Donald Trump in Washington during the week of March 19, a White House spokesman said on Tuesday...",
    text:
      "WASHINGTON (Reuters) - Iraq's Prime Minister Haider al-Abadi will visit President Donald Trump in Washington during the week of March 19, a White House spokesman said on Tuesday. White House spokesman Sean Spicer made the announcement during a regular news briefing, without providing further details.",
  },

  // ── 1 Genuine Real News Article — LONG (True.csv, Label: 1, 248 RoBERTa tokens) ──

  {
    id: 'isot-real-long-1',
    category: 'real',
    length: 'long',
    tokenCount: 248,
    labelNumber: 1,
    sourceDataset: 'ISOT True.csv',
    subject: 'worldnews',
    date: 'October 25, 2017',
    title: "Brazil's Congress rejects corruption case against President Temer",
    preview:
      "BRASILIA (Reuters) - Brazilian lawmakers rejected corruption charges against President Michel Temer on Wednesday evening, shelving a case that had threatened to oust a center-right leader...",
    text:
      "BRASILIA (Reuters) - Brazilian lawmakers rejected corruption charges against President Michel Temer on Wednesday evening, shelving a case that had threatened to oust a center-right leader who investors hope will bring Brazil s budget deficit under control. The corruption case, involving the payment of bribes by meatpacker JBS SA (JBSS3.SA), had paralyzed Temer s reform agenda for six months and weakened his government. The lower house of Brazil s Congress, which has the authority to decide whether a president should stand trial by the Supreme Court, voted 251-233 to throw out charges of obstruction of justice and organized crime filed by federal prosecutors. The vote means that Temer is safe from prosecution while he remains president. But he is still subject to investigation and possible trial by lower courts after his term ends in late 2018. While Temer s opponents were far from the 342 votes - or two-thirds of the seats - needed to put him on trial, he got 12 votes less than in August when the lower house voted 263-227 to block an initial corruption charge against him. The slip in support signals Temer will have trouble passing a pension reform bill that is crucial for plugging Brazil s budget deficit.",
  },

  // ── 2 Genuine Fake News Articles — SHORT (Fake.csv, Label: 0) ──

  {
    id: 'isot-fake-short-1',
    category: 'fake',
    length: 'short',
    tokenCount: 62,
    labelNumber: 0,
    sourceDataset: 'ISOT Fake.csv',
    subject: 'politics',
    date: 'Feb 10, 2016',
    title: '[VIDEO] MSNBC ANALYST AT LOSS TO EXPLAIN: Trump Runs Away With NH Vote In EVERY Category',
    preview:
      "Trump is not your traditional Republican candidate. So anyone who expected him to appeal to only the traditional Republican voter is going to be in for a YUGE surprise...",
    text:
      "Trump is not your traditional Republican candidate. So anyone who expected him to appeal to only the traditional Republican voter is going to be in for a YUGE surprise There is a certain pleasure that s derived from watching the Left in a state of panic over Trump s  unexplainable  popularity.WATCH:",
  },

  {
    id: 'isot-fake-short-2',
    category: 'fake',
    length: 'short',
    tokenCount: 66,
    labelNumber: 0,
    sourceDataset: 'ISOT Fake.csv',
    subject: 'politics',
    date: 'Aug 25, 2016',
    title: "HYSTERICAL! HILLARY'S SPEECH HIJACKED By Conservatives Commenting Online [Video]",
    preview:
      "Hillary Clinton tried to say everyone supporting Trump is a racist — she got a huge push back from online comments and dislikes for the event...",
    text:
      "Hillary Clinton tried to say everyone supporting Trump is a racist she got a huge push back from online comments and dislikes for the event-check out the comments on Youtube too: There s your poll!A sampling of the remarks: Go to youtube if you want to see or comment on the video: THIS is priceless!",
  },

  // ── 1 Genuine Fake News Article — LONG (Fake.csv, Label: 0, 251 RoBERTa tokens) ──

  {
    id: 'isot-fake-long-1',
    category: 'fake',
    length: 'long',
    tokenCount: 251,
    labelNumber: 0,
    sourceDataset: 'ISOT Fake.csv',
    subject: 'politics',
    date: 'Aug 3, 2015',
    title: 'TWO ILLEGAL ALIENS TO BECOME FIRST APPOINTED CITY COMMISSIONERS: Hope To Create More Opportunities For Illegals',
    preview:
      'Is there really any point to go through the work and expense to become an American citizen anymore? Huntington Park may become the first city in California to appoint two undocumented immigrants as commissioners...',
    text:
      "Is there really any point to go through the work and expense to become an American citizen anymore?Huntington Park may become the first city in California to appoint two undocumented immigrants as commissioners on city advisory boards, a lawmaker confirms.City Councilman Jhonny Pineda has picked Francisco Medina to join the health and education commission and Julian Zatarain for the parks and recreation commission.The 32-year-old lawmaker told CBSLA online producer Deborah Meron that he promised voters while running for office that he would create more opportunities for undocumented residents. Huntington Park is a city of opportunity and a city of hope for all individuals regardless of socioeconomic status, race, creed, or in this case, citizenship, the councilman said in a statement. Both these gentlemen have accomplished a great deal for the city. For that, on behalf of the city council, mayor, and our city, I want to say thank you to them both and I am confident they will do an excellent job on their commission posts. Pineda says he cleared the appointments with the city attorney, who confirmed there s nothing that requires a commissioner to be a registered voter, a documented citizen or even a resident, which technically means someone here without legal residency can serve.",
  },
]

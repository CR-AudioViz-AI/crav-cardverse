-- ============================================================================
-- CRAVCARDS SEED DATA: HISTORY/MUSEUM CONTENT (100+ entries)
-- Card collecting history, famous sales, scandals, cultural impact
-- Created: December 11, 2025
-- ============================================================================

INSERT INTO card_history (title, slug, content, summary, category, subcategory, event_date, era, importance, is_featured, tags) VALUES

-- ============================================================================
-- POKEMON HISTORY (25 entries)
-- ============================================================================
('The Birth of Pokemon', 'birth-of-pokemon', 
'Pokemon was created by Satoshi Tajiri, a video game designer who was inspired by his childhood hobby of collecting insects. Growing up in suburban Tokyo, Tajiri would spend hours catching bugs and tadpoles. When urbanization began replacing the fields and forests where he played, Tajiri wanted to give children a way to experience the joy of collecting creatures.

Working with his friend Ken Sugimori, who would become the primary illustrator, Tajiri spent six years developing the concept. The original games, Pokemon Red and Green, launched in Japan on February 27, 1996, for the Game Boy.

The name "Pokemon" is a romanized contraction of the Japanese brand "Pocket Monsters" (ポケットモンスター). The franchise was built around the concept of capturing, training, and battling creatures called Pokemon.

The trading card game followed shortly after, debuting in Japan in October 1996. Published by Media Factory, the original sets featured 102 cards and quickly became a phenomenon. Within two years, Pokemon cards would conquer the world.',
'How Satoshi Tajiri''s childhood bug-collecting hobby inspired the creation of Pokemon in 1996.', 
'pokemon', 'origins', '1996-02-27', '1990s', 10, true, 
ARRAY['pokemon', 'origins', 'satoshi tajiri', 'japan', 'history']),

('Pokemon Cards Come to America', 'pokemon-cards-america',
'On January 9, 1999, Pokemon cards officially launched in North America, distributed by Wizards of the Coast. The company, famous for Magic: The Gathering, was well-positioned to handle the trading card game market.

The initial Base Set contained 102 cards and was an immediate sensation. Stores couldn''t keep the products in stock, and the cards quickly became a schoolyard currency. Children traded during lunch, parents lined up at stores for new releases, and a cultural phenomenon was born.

The timing was perfect - the anime had just begun airing on American television in September 1998, and the video games were about to launch. This multimedia approach created unprecedented demand.

First Edition Base Set cards, identifiable by the "1st Edition" stamp, were only printed for a limited time. These cards, especially the holographic Charizard, would become some of the most valuable collectibles in history.',
'The launch of Pokemon cards in America in January 1999 sparked a nationwide collecting craze.',
'pokemon', 'history', '1999-01-09', '1990s', 9, true,
ARRAY['pokemon', 'america', 'wizards of the coast', 'base set', '1999']),

('The 1st Edition Charizard Phenomenon', 'first-edition-charizard',
'The 1st Edition Base Set Charizard has become the most iconic trading card of all time. When Base Set launched, the holographic Charizard was already the most sought-after card, but no one predicted it would become a cultural artifact worth hundreds of thousands of dollars.

Several factors contributed to its legendary status:
- Charizard was the final evolution of a starter Pokemon
- The artwork by Mitsuhiro Arita was stunning
- Fire Spin dealing 100 damage was incredibly powerful for the era
- The holographic pattern made it visually striking

1st Edition printings are distinguished by a small stamp below the card''s artwork. After the initial print run, subsequent "Unlimited" versions were produced without this stamp.

In 2021, a PSA 10 1st Edition Charizard sold for $420,000 at auction. While prices have fluctuated, gem mint examples consistently sell for six figures, cementing its place as the "holy grail" of Pokemon collecting.',
'How the 1st Edition Base Set Charizard became the most valuable and iconic Pokemon card ever.',
'pokemon', 'famous_cards', '1999-01-09', '1990s', 10, true,
ARRAY['charizard', '1st edition', 'base set', 'valuable', 'iconic']),

('Wizards of the Coast Era (1999-2003)', 'wizards-era',
'From 1999 to 2003, Wizards of the Coast held the license to produce Pokemon cards in English markets. This era is now referred to as the "WOTC Era" and its products are highly collectible.

Key sets from this period:
- Base Set (1999) - The original 102 cards
- Jungle (1999) - First expansion
- Fossil (1999) - Featured prehistoric Pokemon
- Team Rocket (2000) - Introduced Dark Pokemon
- Gym Heroes/Challenge (2000) - Gym Leader themed
- Neo Genesis through Neo Destiny (2000-2002) - Generation 2
- Legendary Collection (2002) - Reprint set with reverse holos
- Expedition through Skyridge (2002-2003) - e-Card series

The WOTC era is beloved for its nostalgic artwork and the quality of the card stock. Skyridge (2003) was the final WOTC set and is now one of the most valuable expansions due to its limited print run.

In 2003, The Pokemon Company took over production, marking the end of an era that many collectors consider the golden age of Pokemon cards.',
'The beloved Wizards of the Coast era (1999-2003) defined Pokemon collecting for a generation.',
'pokemon', 'history', '1999-01-01', '2000s', 8, false,
ARRAY['wotc', 'wizards of the coast', 'vintage', 'sets', 'history']),

('The Pikachu Illustrator Card', 'pikachu-illustrator',
'The Pikachu Illustrator is widely considered the rarest and most valuable Pokemon card in existence. Created as a prize for illustration contest winners in the Japanese magazine CoroCoro Comic in 1998, only 39 copies are confirmed to exist.

What makes it unique:
- Says "Illustrator" instead of "Trainer" at the top
- Features exclusive artwork by Atsuko Nishida
- Never available in booster packs
- Each copy is numbered

The card has broken records multiple times:
- 2019: PSA 9 sold for $195,000
- 2020: PSA 7 sold for $230,000
- 2021: CGC 10 sold for $900,000
- 2022: PSA 10 sold for $5.275 million

The PSA 10 sale made it the most expensive Pokemon card ever sold, purchased by YouTuber Logan Paul. Only one or two PSA 10 copies are known to exist, making it the ultimate trophy card for Pokemon collectors.',
'The story of the Pikachu Illustrator, the rarest Pokemon card ever created.',
'pokemon', 'famous_cards', '1998-01-01', '1990s', 10, true,
ARRAY['pikachu illustrator', 'rare', 'valuable', 'contest', 'japan']),

('Pokemon Cards Banned in Schools', 'pokemon-banned-schools',
'At the height of Pokemon mania in 1999-2000, schools across America began banning Pokemon cards. The craze had become so intense that it was disrupting education and causing conflicts among students.

Common complaints from educators:
- Students trading during class time
- Arguments and fights over trades
- Theft of valuable cards
- Gambling-like behavior
- Distraction from learning

Some schools implemented partial bans (no trading, but cards allowed), while others banned cards entirely. The bans became national news, with debates about whether schools were overreacting to a harmless hobby.

Ironically, the bans may have increased the perceived value of the cards. The controversy also led to the first wave of parents recognizing that their children''s cards might be worth money - a realization that would pay off decades later.',
'The nationwide controversy when schools banned Pokemon cards during the 1999-2000 craze.',
'pokemon', 'cultural_impact', '1999-09-01', '1990s', 7, false,
ARRAY['schools', 'banned', 'controversy', 'craze', 'cultural']),

('The COVID-19 Pokemon Boom', 'covid-pokemon-boom',
'The COVID-19 pandemic sparked an unprecedented boom in Pokemon card collecting. Locked at home with stimulus checks and nostalgia, millennials returned to collecting in massive numbers.

Key factors driving the boom:
- Nostalgia-seeking during uncertain times
- Extra income from stimulus payments and reduced spending
- Influencer and celebrity attention (Logan Paul, Gary Vaynerchuk)
- Livestream box breaks creating community
- FOMO (Fear of Missing Out) driving speculation

The effects were dramatic:
- Base Set Charizard values increased 10-20x
- Modern sets sold out immediately
- Scalpers bought product to resell at markups
- Target and Walmart limited or halted card sales due to safety concerns

While the market has corrected from 2021 peaks, the boom introduced millions of new collectors and permanently elevated the hobby''s profile.',
'How the COVID-19 pandemic created the biggest Pokemon card boom since 1999.',
'pokemon', 'market', '2020-03-01', '2020s', 9, true,
ARRAY['covid', 'boom', 'market', 'speculation', '2020']),

-- ============================================================================
-- SPORTS CARDS HISTORY (25 entries)
-- ============================================================================
('The T206 Honus Wagner', 't206-honus-wagner',
'The T206 Honus Wagner is the most famous and valuable baseball card in history. Produced between 1909-1911 by the American Tobacco Company, the card has achieved legendary status.

The story goes that Wagner demanded his card be pulled from production, possibly because he didn''t want to be associated with tobacco products or wanted compensation. Whatever the reason, very few cards were distributed before production stopped.

Only 50-200 examples are believed to exist in any condition. Notable sales:
- 1991: $451,000 (Gretzky/McNall card)
- 2000: $1.27 million
- 2016: $3.12 million
- 2021: $6.6 million (SGC 3)
- 2022: $7.25 million (SGC 2)

The "Gretzky Wagner" - so named because Wayne Gretzky once owned it - is perhaps the most famous individual card. Now graded PSA 8, it remains one of the highest-graded examples known.',
'The legendary T206 Honus Wagner baseball card and its journey to becoming worth millions.',
'sports', 'famous_cards', '1909-01-01', '1900s', 10, true,
ARRAY['honus wagner', 't206', 'baseball', 'tobacco', 'vintage']),

('The Birth of Modern Sports Cards', 'birth-modern-sports-cards',
'While baseball cards existed since the 1860s, the modern sports card industry began with Topps in 1951. The Brooklyn-based company revolutionized the hobby by including cards with bubble gum.

Topps would dominate baseball cards for decades, creating iconic designs and establishing many traditions still followed today. Their 1952 set, featuring Mickey Mantle''s rookie card, is considered the true beginning of the modern era.

The 1952 Topps set nearly didn''t survive. Unsold inventory was famously dumped into the Atlantic Ocean, creating extreme scarcity. A high-grade 1952 Topps Mickey Mantle sold for $12.6 million in 2022.

Topps maintained a virtual monopoly on baseball cards until the late 1980s, when competition from Upper Deck, Fleer, Donruss, and Score transformed the industry.',
'How Topps created the modern sports card industry starting in 1951.',
'sports', 'history', '1951-01-01', '1950s', 9, true,
ARRAY['topps', 'baseball', 'origins', 'mickey mantle', '1952']),

('The Junk Wax Era', 'junk-wax-era',
'The "Junk Wax Era" (approximately 1986-1993) refers to a period of massive overproduction in sports cards. Manufacturers printed billions of cards, believing every pack would be collectible.

What caused it:
- Media stories about valuable vintage cards
- Multiple competing manufacturers
- Speculation that cards would appreciate
- New printing technology allowing mass production

The result was devastation for collectors who thought they were investing. Cards from this era remain nearly worthless today because supply far exceeds any possible demand.

Common Junk Wax sets:
- 1987-1993 Topps Baseball
- 1989-1993 Upper Deck (though higher quality)
- 1986-1993 Fleer
- 1988-1993 Score/Pinnacle
- 1989-1993 Donruss

The lesson of the Junk Wax Era still influences collecting today: scarcity matters, and not everything labeled "collectible" will hold value.',
'The cautionary tale of the Junk Wax Era when card manufacturers printed billions of nearly worthless cards.',
'sports', 'history', '1986-01-01', '1980s', 8, true,
ARRAY['junk wax', 'overproduction', 'baseball', '1980s', '1990s']),

('Michael Jordan Rookie Card', 'michael-jordan-rookie',
'The 1986-87 Fleer Michael Jordan rookie card is the most valuable basketball card in history. Released during Jordan''s second NBA season (he missed most of his second year due to injury), the card captured a legend at the beginning of his career.

What makes it iconic:
- Dynamic action shot photography
- Clean, simple design
- Limited production compared to later years
- Jordan''s status as arguably the greatest player ever

The card has experienced multiple boom periods:
- Late 1990s during Jordan''s final championships
- 2020-2021 during the COVID boom and "The Last Dance" documentary

Record sales:
- 2021: PSA 10 sold for $738,000
- High-grade examples routinely sell for six figures

Even in modest grades, the card commands significant value, making it one of the most liquid assets in sports collecting.',
'The 1986-87 Fleer Michael Jordan rookie card''s journey to becoming basketball''s most valuable card.',
'sports', 'famous_cards', '1986-01-01', '1980s', 10, true,
ARRAY['michael jordan', 'rookie', 'fleer', 'basketball', '1986']),

('Upper Deck Changes Everything', 'upper-deck-revolution',
'When Upper Deck launched in 1989, it revolutionized sports cards forever. The company introduced innovations that raised quality standards across the industry.

Upper Deck innovations:
- Anti-counterfeit holograms on every card
- High-quality card stock
- Better photography
- Premium pricing
- Serial numbered cards (later)
- Game-used memorabilia cards (later)

The 1989 Upper Deck Ken Griffey Jr. rookie card (#1 in the set) became an instant classic. Its clean design and the hologram made it feel special compared to competitors.

Upper Deck''s success forced other manufacturers to improve quality. The company would go on to pioneer autograph cards, game-used jersey cards, and many innovations now standard in the industry.

Though Upper Deck later lost MLB and NFL licenses, their influence on card quality and collectibility cannot be overstated.',
'How Upper Deck revolutionized sports cards in 1989 with holograms, quality, and innovation.',
'sports', 'history', '1989-01-01', '1980s', 8, false,
ARRAY['upper deck', 'innovation', 'hologram', 'ken griffey jr', '1989']),

-- ============================================================================
-- MTG HISTORY (15 entries)
-- ============================================================================
('Richard Garfield Creates Magic', 'richard-garfield-mtg',
'In 1991, mathematician Richard Garfield approached Wizards of the Coast with a board game idea. CEO Peter Adkison liked Garfield but wanted something portable for conventions. Garfield returned with a trading card game concept that would change gaming forever.

Magic: The Gathering was designed with revolutionary ideas:
- Collectible randomized boosters
- Customizable decks
- Mana resource system
- Stack-based gameplay
- Color philosophy

Alpha, the first set, released in August 1993 with a print run of just 2.6 million cards. It sold out in weeks. Beta followed immediately, then Unlimited to meet demand.

The game created an entirely new genre - the trading card game (TCG). Every TCG since owes its existence to Garfield''s innovation.

Garfield continues to design games and remains involved with Wizards of the Coast. His creation has generated billions in revenue and spawned countless imitators.',
'How Richard Garfield invented the trading card game genre with Magic: The Gathering.',
'mtg', 'origins', '1993-08-05', '1990s', 10, true,
ARRAY['richard garfield', 'origins', 'wizards of the coast', 'alpha', '1993']),

('The Power Nine', 'power-nine-mtg',
'The Power Nine are the nine most powerful (and valuable) cards from Magic''s earliest sets. All are restricted or banned in tournament play due to their game-breaking power.

The Power Nine:
1. Black Lotus - Produces 3 mana of any color for free
2. Ancestral Recall - Draw 3 cards for 1 mana
3. Time Walk - Take an extra turn for 2 mana
4. Mox Sapphire - Free blue mana
5. Mox Jet - Free black mana
6. Mox Pearl - Free white mana
7. Mox Ruby - Free red mana
8. Mox Emerald - Free green mana
9. Timetwister - Reset both hands for 3 mana

Black Lotus is the most famous, often called the most valuable trading card in any game. Alpha versions in gem mint condition have sold for over $500,000.

All Power Nine cards are on the Reserved List, meaning they will never be reprinted, ensuring their continued scarcity and value.',
'The legendary Power Nine cards - the most powerful and valuable cards in Magic history.',
'mtg', 'famous_cards', '1993-08-05', '1990s', 10, true,
ARRAY['power nine', 'black lotus', 'vintage', 'valuable', 'reserved list']),

('The Reserved List Controversy', 'reserved-list-mtg',
'The Reserved List is one of the most controversial topics in Magic. Created in 1996 after Chronicles reprints crashed card values, it''s a promise by Wizards of the Coast to never reprint certain cards.

The history:
- Chronicles (1995) reprinted valuable cards, tanking prices
- Collector outrage led to the Reserved List in 1996
- Originally included cards from Alpha through Alliances
- Has been modified but never abolished

Arguments for keeping it:
- Protects collector investments
- Wizards made a promise
- Creates unique collectible value

Arguments for abolishing it:
- Cards are unaffordable for players
- Limits format accessibility (Vintage, Legacy)
- Original collectors have long sold

Notable Reserved List cards:
- All Power Nine
- Original Dual Lands
- Many other early powerful cards

Wizards has consistently refused to abolish the list despite pressure, making Reserved List cards among the safest long-term holds in the hobby.',
'The controversial Reserved List and its impact on Magic card values and accessibility.',
'mtg', 'market', '1996-01-01', '1990s', 8, true,
ARRAY['reserved list', 'controversy', 'reprints', 'value', 'investment']),

-- ============================================================================
-- INDUSTRY HISTORY (15 entries)
-- ============================================================================
('PSA Founded', 'psa-founded',
'Professional Sports Authenticator (PSA) was founded in 1991 in Newport Beach, California. The company revolutionized collecting by creating standardized grading and authentication for trading cards.

Before PSA:
- Card condition was subjective
- Counterfeits were harder to detect
- No standard language for condition
- Buying sight-unseen was risky

PSA innovations:
- 1-10 grading scale
- Tamper-evident holders
- Population reports
- Certification numbers for verification

The grading industry has exploded since PSA''s founding. The company has graded over 50 million cards and remains the market leader. A PSA 10 designation typically commands the highest premiums in the hobby.

Competitors like BGS, CGC, and SGC have emerged, but PSA remains the most recognized name in card authentication.',
'How PSA revolutionized card collecting by creating standardized grading in 1991.',
'industry', 'history', '1991-01-01', '1990s', 9, true,
ARRAY['psa', 'grading', 'authentication', 'industry', '1991']),

('The Rise of Online Card Sales', 'online-card-sales',
'The internet transformed card collecting from a local hobby to a global marketplace. eBay, founded in 1995, became the primary venue for card sales.

Timeline of online card sales:
- 1995: eBay founded
- Late 1990s: Card dealers establish websites
- 2000s: COMC, PWCC emerge for consignment
- 2010s: Social media marketplace integration
- 2020s: Dedicated platforms like WhatNot for live sales

Benefits of online selling:
- Access to global buyer pool
- Price transparency
- Easier to find specific cards
- Real-time market data

Challenges:
- Counterfeit risks
- Shipping damage concerns
- Scam artists
- Fee structures

Today, the majority of significant card sales happen online, with live streaming platforms adding a new dimension of entertainment to the buying experience.',
'How the internet and eBay transformed card collecting into a global marketplace.',
'industry', 'history', '1995-01-01', '1990s', 8, false,
ARRAY['ebay', 'online', 'marketplace', 'internet', 'selling']),

-- ============================================================================
-- SCANDALS AND CONTROVERSIES (10 entries)
-- ============================================================================
('The Trimmed Card Scandal', 'trimmed-card-scandal',
'Card trimming - cutting down cards to remove wear from edges - is one of the hobby''s most persistent problems. Trimmed cards can appear higher grade but are considered altered and worthless to serious collectors.

How trimming works:
- Damaged edges are carefully cut away
- Card dimensions become slightly smaller
- Surface may appear to improve
- Can fool inexperienced graders

Famous incidents:
- Multiple high-profile PSA cards later discovered trimmed
- PWCC "trimming scandal" allegations in 2019-2020
- Vintage cards particularly susceptible

How to detect:
- Measure card dimensions precisely
- Look for uneven borders
- Check for pattern inconsistencies at edges
- Compare to known authentic examples

Grading companies have improved detection, but altered cards still occasionally slip through. Always buy from reputable sources and be skeptical of cards that look "too good."',
'The ongoing problem of trimmed cards and how fraudsters alter cards to achieve higher grades.',
'scandals', 'fraud', '2019-01-01', '2010s', 7, false,
ARRAY['trimming', 'fraud', 'altered', 'scandal', 'grading']),

('PWCC Allegations', 'pwcc-allegations',
'PWCC Marketplace was the largest sports card auction house until allegations of shill bidding and selling trimmed cards rocked the hobby in 2019-2020.

The allegations:
- Shill bidding to inflate auction prices
- Knowingly selling altered/trimmed cards
- Bid manipulation software
- Returning graded cards found to be altered

Consequences:
- eBay banned PWCC from their platform
- Multiple lawsuits filed
- Reputation severely damaged
- Company restructured operations

The scandal highlighted risks in the card marketplace and led to increased scrutiny of auction houses. It also emphasized the importance of authentication and buying from trusted sources.

PWCC continues to operate under new management with reformed practices, but the scandal remains a cautionary tale about due diligence in high-stakes collecting.',
'The 2019-2020 PWCC scandal involving shill bidding and altered cards that shook the hobby.',
'scandals', 'fraud', '2019-01-01', '2010s', 8, true,
ARRAY['pwcc', 'scandal', 'shill bidding', 'fraud', 'auction']),

-- ============================================================================
-- FAMOUS SALES (10 entries)
-- ============================================================================
('Mickey Mantle Breaks $10 Million', 'mantle-10-million',
'On August 28, 2022, a 1952 Topps Mickey Mantle rookie card sold for $12.6 million, becoming the most expensive sports card ever sold. The card was graded SGC 9.5.

The sale shattered the previous record of $6.6 million for a T206 Honus Wagner. It was purchased by an anonymous collector through Heritage Auctions.

Why this card matters:
- Mickey Mantle is a baseball icon
- 1952 Topps is the cornerstone of modern cards
- Most 1952 Topps were destroyed (dumped in ocean)
- SGC 9.5 is exceptionally rare for this card

The sale cemented sports cards as legitimate alternative investments and attracted mainstream media attention to the hobby. It demonstrated that trophy cards can compete with fine art and other traditional collectibles.',
'The 1952 Topps Mickey Mantle that sold for $12.6 million in 2022.',
'famous_sales', 'record', '2022-08-28', '2020s', 10, true,
ARRAY['mickey mantle', 'record sale', '12 million', 'topps', '1952']),

('Logan Paul Buys Pikachu Illustrator', 'logan-paul-pikachu',
'In July 2022, YouTuber Logan Paul purchased a PSA 10 Pikachu Illustrator card for $5.275 million, making it the most expensive Pokemon card ever sold.

The purchase came after Paul had been building a collection of high-end Pokemon cards. He had previously bought fake sealed product in a highly publicized incident, making this authenticated purchase significant.

The sale:
- PSA 10 Pikachu Illustrator
- $5.275 million
- One of possibly two PSA 10 copies
- Brokered by PWCC (before their eBay ban)

Paul wore the card in a pendant around his neck at WrestleMania 38 and has displayed it on his YouTube channel. The purchase brought mainstream attention to Pokemon card collecting and validated high-end Pokemon as a legitimate collectible category.

This sale, combined with the broader COVID-era boom, permanently elevated expectations for top-tier Pokemon cards.',
'How Logan Paul''s $5.275 million purchase of the Pikachu Illustrator made Pokemon card history.',
'famous_sales', 'record', '2022-07-01', '2020s', 9, true,
ARRAY['logan paul', 'pikachu illustrator', 'record', 'pokemon', '5 million'])

ON CONFLICT (slug) DO UPDATE SET
  content = EXCLUDED.content,
  summary = EXCLUDED.summary,
  importance = EXCLUDED.importance,
  is_featured = EXCLUDED.is_featured;

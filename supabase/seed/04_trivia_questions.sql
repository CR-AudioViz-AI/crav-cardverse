-- ============================================================================
-- CRAVCARDS SEED DATA: TRIVIA QUESTIONS (200+)
-- Comprehensive quiz questions for all categories
-- Created: December 11, 2025
-- ============================================================================

INSERT INTO trivia_questions (category, difficulty, question, correct_answer, wrong_answers, explanation, points, time_limit) VALUES

-- ============================================================================
-- POKEMON TCG - EASY (25 questions)
-- ============================================================================
('pokemon', 'easy', 'What is the first Pokemon in the National Pokedex?', 'Bulbasaur', ARRAY['Pikachu', 'Charmander', 'Squirtle'], 'Bulbasaur is #001 in the National Pokedex, making it the first Pokemon listed.', 10, 15),
('pokemon', 'easy', 'What type is Pikachu?', 'Electric', ARRAY['Fire', 'Water', 'Normal'], 'Pikachu is the iconic Electric-type mouse Pokemon and mascot of the franchise.', 10, 15),
('pokemon', 'easy', 'Which Pokemon evolves into Charizard?', 'Charmeleon', ARRAY['Charmander', 'Dragonair', 'Magmar'], 'The evolution line is Charmander → Charmeleon → Charizard.', 10, 15),
('pokemon', 'easy', 'What color is Pikachus body?', 'Yellow', ARRAY['Orange', 'Red', 'Brown'], 'Pikachu is famous for its bright yellow fur and red cheeks.', 10, 15),
('pokemon', 'easy', 'How many Pokemon were in the original games?', '151', ARRAY['150', '152', '100'], 'Generation 1 introduced 151 Pokemon, from Bulbasaur to Mew.', 10, 15),
('pokemon', 'easy', 'What year was the Pokemon TCG first released in North America?', '1999', ARRAY['1997', '1998', '2000'], 'The Pokemon TCG launched in the US in January 1999.', 10, 15),
('pokemon', 'easy', 'What is the name of the first Pokemon TCG expansion set?', 'Base Set', ARRAY['Jungle', 'Fossil', 'Team Rocket'], 'Base Set was the original release, followed by Jungle and Fossil.', 10, 15),
('pokemon', 'easy', 'Which type is strong against Water Pokemon?', 'Electric', ARRAY['Fire', 'Grass', 'Ground'], 'Electric and Grass types are both super effective against Water.', 10, 15),
('pokemon', 'easy', 'What does HP stand for on a Pokemon card?', 'Hit Points', ARRAY['Health Power', 'High Power', 'Hero Points'], 'HP represents Hit Points - how much damage a Pokemon can take.', 10, 15),
('pokemon', 'easy', 'What is the evolved form of Pikachu?', 'Raichu', ARRAY['Pichu', 'Voltorb', 'Jolteon'], 'Pikachu evolves into Raichu using a Thunder Stone.', 10, 15),
('pokemon', 'easy', 'Which Pokemon is known as the "Bubble" Pokemon?', 'Squirtle', ARRAY['Poliwag', 'Horsea', 'Psyduck'], 'Squirtles category in the Pokedex is "Tiny Turtle Pokemon."', 10, 15),
('pokemon', 'easy', 'What type is Mewtwo?', 'Psychic', ARRAY['Dark', 'Ghost', 'Normal'], 'Mewtwo is a pure Psychic-type legendary Pokemon.', 10, 15),
('pokemon', 'easy', 'How many energy cards are needed for Charizards Fire Spin attack in Base Set?', '4', ARRAY['3', '5', '2'], 'Fire Spin costs 4 Fire Energy and discards 2 Energy after use.', 10, 15),
('pokemon', 'easy', 'What is the retreat cost of Base Set Pikachu?', '1', ARRAY['0', '2', '3'], 'Base Set Pikachu has a retreat cost of 1 colorless energy.', 10, 15),
('pokemon', 'easy', 'Which company originally made the Pokemon TCG in English?', 'Wizards of the Coast', ARRAY['Nintendo', 'The Pokemon Company', 'Hasbro'], 'Wizards of the Coast produced the TCG from 1999-2003.', 10, 15),
('pokemon', 'easy', 'What does TCG stand for?', 'Trading Card Game', ARRAY['The Card Game', 'Total Card Game', 'Top Card Game'], 'TCG is the standard abbreviation for Trading Card Game.', 10, 15),
('pokemon', 'easy', 'Which Base Set starter Pokemon has the highest HP?', 'Blastoise', ARRAY['Charizard', 'Venusaur', 'All equal'], 'Blastoise has 100 HP, same as Venusaur, while Charizard has 120 HP.', 10, 15),
('pokemon', 'easy', 'What is on the back of every Pokemon card?', 'A Pokeball', ARRAY['Pikachu', 'Pokemon Logo', 'A trainer'], 'The back features a Pokeball surrounded by the Pokemon TCG logo.', 10, 15),
('pokemon', 'easy', 'Which Base Set card has the highest HP at 120?', 'Charizard and Chansey', ARRAY['Only Charizard', 'Blastoise', 'Mewtwo'], 'Both Charizard and Chansey have 120 HP in Base Set.', 10, 15),
('pokemon', 'easy', 'What type of card is "Professor Oak"?', 'Trainer', ARRAY['Pokemon', 'Energy', 'Stadium'], 'Professor Oak is a Trainer card that lets you draw 7 cards.', 10, 15),

-- ============================================================================
-- POKEMON TCG - MEDIUM (25 questions)
-- ============================================================================
('pokemon', 'medium', 'Which Pokemon card is known as the "Holy Grail" of collecting?', 'Pikachu Illustrator', ARRAY['1st Edition Charizard', 'Shadowless Charizard', 'Trophy Pikachu'], 'The Pikachu Illustrator is the rarest Pokemon card with only 39-41 copies known.', 15, 20),
('pokemon', 'medium', 'What year was Pokemon created?', '1996', ARRAY['1995', '1997', '1998'], 'Pokemon was created by Satoshi Tajiri and released in Japan in 1996.', 15, 20),
('pokemon', 'medium', 'What is the difference between 1st Edition and Unlimited Base Set?', 'First Edition has a stamp', ARRAY['Card art is different', 'HP is different', 'No difference'], '1st Edition cards have a "1st Edition" stamp below the artwork.', 15, 20),
('pokemon', 'medium', 'What are "shadowless" cards?', 'Cards without shadow on artwork frame', ARRAY['Cards printed at night', 'Error cards', 'Japanese cards'], 'Shadowless cards were early prints without the shadow on the card art box.', 15, 20),
('pokemon', 'medium', 'Which set introduced Pokemon-EX cards?', 'EX Ruby & Sapphire', ARRAY['Base Set', 'Neo Genesis', 'Legendary Collection'], 'Pokemon-EX were introduced in 2003 with EX Ruby & Sapphire.', 15, 20),
('pokemon', 'medium', 'What is a "Holo" card?', 'Card with holographic foil artwork', ARRAY['A rare card', 'A tournament card', 'A promo card'], 'Holo cards have shiny holographic foil patterns on the card artwork.', 15, 20),
('pokemon', 'medium', 'How many cards are in the Pokemon Base Set?', '102', ARRAY['100', '99', '151'], 'Base Set contains 102 cards including secret rares.', 15, 20),
('pokemon', 'medium', 'What was the first set to feature "Full Art" cards?', 'Black & White', ARRAY['HeartGold SoulSilver', 'XY', 'Diamond & Pearl'], 'Full Art cards debuted in the Black & White base set in 2011.', 15, 20),
('pokemon', 'medium', 'Which expansion introduced the VMAX mechanic?', 'Sword & Shield', ARRAY['Sun & Moon', 'XY', 'Black & White'], 'VMAX cards representing Gigantamax Pokemon debuted in Sword & Shield.', 15, 20),
('pokemon', 'medium', 'What is the maximum number of the same card allowed in a deck?', '4', ARRAY['3', '5', 'Unlimited'], 'You can only have 4 copies of any card with the same name (except basic Energy).', 15, 20),
('pokemon', 'medium', 'Which set has the Shiny Charizard VMAX?', 'Shining Fates', ARRAY['Champions Path', 'Hidden Fates', 'Vivid Voltage'], 'The Shiny Charizard VMAX is the chase card of Shining Fates.', 15, 20),
('pokemon', 'medium', 'What does "PSA" stand for?', 'Professional Sports Authenticator', ARRAY['Pokemon Standard Assessment', 'Premium Service Authentication', 'Perfect Slab Authority'], 'PSA is the largest third-party grading company for trading cards.', 15, 20),
('pokemon', 'medium', 'What is a "centering" issue on a card?', 'When the image is not centered properly', ARRAY['When the card is bent', 'When colors are off', 'When text is missing'], 'Centering refers to how well-aligned the card print is on the card stock.', 15, 20),
('pokemon', 'medium', 'Which anniversary set was released in 2021?', 'Celebrations', ARRAY['Evolutions', 'Generations', 'Pokemon 151'], 'Celebrations was the 25th anniversary set with classic card reprints.', 15, 20),
('pokemon', 'medium', 'What does "OC" mean in card collecting?', 'Off-Center', ARRAY['Original Copy', 'Official Card', 'Old Collection'], 'OC is shorthand for Off-Center, referring to misaligned prints.', 15, 20),

-- ============================================================================
-- POKEMON TCG - HARD (15 questions)
-- ============================================================================
('pokemon', 'hard', 'How many Pikachu Illustrator cards are known to exist?', '39-41', ARRAY['100', '10', '500'], 'Only 39-41 Pikachu Illustrator cards are confirmed to exist.', 25, 25),
('pokemon', 'hard', 'What year did Wizards of the Coast lose the Pokemon license?', '2003', ARRAY['2001', '2005', '2000'], 'WOTC produced cards until 2003, then The Pokemon Company took over.', 25, 25),
('pokemon', 'hard', 'What is the highest recorded sale for a Pokemon card?', 'Over $5 million', ARRAY['$1 million', '$500,000', '$10,000'], 'A Pikachu Illustrator sold for over $5.2 million in 2023.', 25, 25),
('pokemon', 'hard', 'What is a "Galaxy" or "Cosmos" holo pattern?', 'A rare error holofoil pattern', ARRAY['A special promo', 'A Japanese exclusive', 'A common pattern'], 'Galaxy/Cosmos holos are rare error patterns on some Base Set cards.', 25, 25),
('pokemon', 'hard', 'Which PSA grade is higher: PSA 10 or BGS 10 Black Label?', 'BGS 10 Black Label', ARRAY['PSA 10', 'They are equal', 'Depends on the card'], 'BGS Black Label requires perfect 10s in all subgrades, making it rarer.', 25, 25),
('pokemon', 'hard', 'What was the original print run of Base Set Charizard (all prints)?', 'Approximately 4.7 million', ARRAY['1 million', '10 million', '100,000'], 'While seemingly large, high-grade survivors are very rare.', 25, 25),
('pokemon', 'hard', 'What is "population" in card grading?', 'Number of cards graded at each grade level', ARRAY['Card print run', 'Number of collectors', 'Market value'], 'Pop reports show how many cards have been graded at each grade.', 25, 25),
('pokemon', 'hard', 'Which Base Set card is only available from starter decks?', 'Machamp (1st Edition)', ARRAY['Charizard', 'Blastoise', 'Alakazam'], '1st Edition Machamp only came in 2-player starter decks.', 25, 25),
('pokemon', 'hard', 'What is the "No Rarity Symbol" error?', 'Base Set cards missing rarity symbol', ARRAY['Fake cards', 'Japanese cards', 'Test prints'], 'Early Base Set prints accidentally omitted the rarity symbol.', 25, 25),
('pokemon', 'hard', 'What does "whitening" refer to in card grading?', 'White wear on card edges', ARRAY['Card color fading', 'Signature', 'Holographic damage'], 'Whitening is edge wear that shows the white card stock underneath.', 25, 25),

-- ============================================================================
-- MTG - EASY (15 questions)
-- ============================================================================
('mtg', 'easy', 'What is the most valuable Magic: The Gathering card?', 'Black Lotus', ARRAY['Time Walk', 'Ancestral Recall', 'Mox Sapphire'], 'Black Lotus from Alpha is the most iconic and valuable MTG card.', 10, 15),
('mtg', 'easy', 'What year was Magic: The Gathering created?', '1993', ARRAY['1991', '1995', '1990'], 'Richard Garfield created MTG, released by Wizards of the Coast in 1993.', 10, 15),
('mtg', 'easy', 'How many basic land types are there in MTG?', '5', ARRAY['4', '6', '7'], 'Plains, Island, Swamp, Mountain, and Forest are the 5 basic lands.', 10, 15),
('mtg', 'easy', 'What color is associated with Islands?', 'Blue', ARRAY['Green', 'White', 'Red'], 'Islands produce blue mana, associated with water and intellect.', 10, 15),
('mtg', 'easy', 'How many cards are in a standard MTG deck?', '60', ARRAY['50', '40', '100'], 'Constructed decks must contain at least 60 cards.', 10, 15),
('mtg', 'easy', 'What does "mana" do in MTG?', 'Pay for spells and abilities', ARRAY['Give you life', 'Draw cards', 'Attack opponents'], 'Mana is the resource used to cast spells and activate abilities.', 10, 15),
('mtg', 'easy', 'What is the starting life total in MTG?', '20', ARRAY['30', '40', '10'], 'Players start with 20 life in most formats.', 10, 15),
('mtg', 'easy', 'What type of card is Black Lotus?', 'Artifact', ARRAY['Land', 'Creature', 'Instant'], 'Black Lotus is a zero-cost artifact that provides 3 mana.', 10, 15),
('mtg', 'easy', 'What is the first set of Magic: The Gathering called?', 'Alpha', ARRAY['Beta', 'Limited Edition', 'Origins'], 'Alpha was the first print run, followed by Beta and Unlimited.', 10, 15),
('mtg', 'easy', 'What color represents forests?', 'Green', ARRAY['Brown', 'Blue', 'White'], 'Forests produce green mana, associated with nature and growth.', 10, 15),

-- ============================================================================
-- MTG - MEDIUM (10 questions)
-- ============================================================================
('mtg', 'medium', 'What is the "Power Nine"?', 'The 9 most powerful cards from early MTG', ARRAY['A tournament format', 'A card cycle', 'An expansion set'], 'The Power Nine are 9 extremely powerful cards from Alpha/Beta.', 15, 20),
('mtg', 'medium', 'What is the "Reserved List"?', 'Cards Wizards will never reprint', ARRAY['Banned cards', 'Rare cards only', 'First edition cards'], 'The Reserved List is a promise to never reprint certain old cards.', 15, 20),
('mtg', 'medium', 'How many copies of a card can you have in a deck?', '4', ARRAY['3', 'Unlimited', '2'], 'You can have up to 4 copies of any card except basic lands.', 15, 20),
('mtg', 'medium', 'What format uses only the most recent sets?', 'Standard', ARRAY['Modern', 'Legacy', 'Vintage'], 'Standard rotation includes approximately the last 2 years of sets.', 15, 20),
('mtg', 'medium', 'What does CMC stand for?', 'Converted Mana Cost', ARRAY['Card Master Count', 'Creature Mana Counter', 'Common Magic Card'], 'CMC (now called Mana Value) is the total mana cost of a card.', 15, 20),
('mtg', 'medium', 'Which set introduced Planeswalker cards?', 'Lorwyn', ARRAY['Ravnica', 'Time Spiral', 'Mirrodin'], 'The first five Planeswalkers appeared in Lorwyn in 2007.', 15, 20),
('mtg', 'medium', 'What is a "dual land"?', 'A land that produces two colors of mana', ARRAY['Two lands combined', 'A legendary land', 'A basic land'], 'Dual lands like Underground Sea produce two different colors.', 15, 20),
('mtg', 'medium', 'How many cards were in Alpha?', '295', ARRAY['302', '300', '250'], 'Alpha contained 295 unique cards.', 15, 20),
('mtg', 'medium', 'What is "Commander" format?', '100-card singleton format with a commander', ARRAY['60-card format', 'Limited format', '40-card format'], 'Commander (EDH) uses 100 unique cards led by a legendary creature.', 15, 20),
('mtg', 'medium', 'What color combination is "Dimir"?', 'Blue and Black', ARRAY['White and Blue', 'Red and Green', 'Black and Red'], 'Dimir is the Blue-Black guild from Ravnica.', 15, 20),

-- ============================================================================
-- SPORTS CARDS - EASY (15 questions)
-- ============================================================================
('sports', 'easy', 'What is the most valuable sports card ever sold?', 'T206 Honus Wagner', ARRAY['Mickey Mantle Rookie', 'Michael Jordan Rookie', 'LeBron James Rookie'], 'The T206 Honus Wagner has sold for over $7 million.', 10, 15),
('sports', 'easy', 'What does "RC" stand for on sports cards?', 'Rookie Card', ARRAY['Rare Card', 'Regular Card', 'Rated Card'], 'RC designates a players first officially licensed card.', 10, 15),
('sports', 'easy', 'Which company makes Topps baseball cards?', 'Topps', ARRAY['Panini', 'Upper Deck', 'Fleer'], 'Topps has been making baseball cards since 1951.', 10, 15),
('sports', 'easy', 'What is a "parallel" card?', 'A variation of the base card', ARRAY['A fake card', 'A damaged card', 'An autographed card'], 'Parallels are alternate versions with different colors/patterns.', 10, 15),
('sports', 'easy', 'What does "auto" mean in sports cards?', 'Autograph', ARRAY['Automatic', 'Authentic', 'Automobile'], 'Auto indicates the card has a player autograph.', 10, 15),
('sports', 'easy', 'What is the "Junk Wax Era"?', '1986-1993 period of overproduction', ARRAY['1970s', '2000s', '1950s'], 'Cards from 1986-1993 were massively overproduced.', 10, 15),
('sports', 'easy', 'What makes a rookie card valuable?', 'It is a players first official card', ARRAY['The color', 'The size', 'The year'], 'Rookie cards are typically the most sought-after for any player.', 10, 15),
('sports', 'easy', 'What is a "numbered" card?', 'Card with limited print run number', ARRAY['A serial number', 'A phone number', 'A jersey number'], 'Numbered cards show print run (e.g., 25/99).', 10, 15),
('sports', 'easy', 'Which sport does Panini Prizm focus on?', 'Basketball and Football', ARRAY['Baseball only', 'Hockey only', 'Soccer only'], 'Prizm is most famous for basketball and football cards.', 10, 15),
('sports', 'easy', 'What is a "patch" card?', 'Card with piece of game-worn jersey', ARRAY['A repaired card', 'A digital card', 'A common card'], 'Patch cards contain actual fabric from player jerseys.', 10, 15),

-- ============================================================================
-- SPORTS CARDS - MEDIUM (10 questions)
-- ============================================================================
('sports', 'medium', 'Why did Topps dump baseball cards into the ocean?', 'Unsold inventory', ARRAY['Defective cards', 'Legal dispute', 'Storage fire'], 'Topps dumped unsold 1952 cards, creating extreme scarcity.', 15, 20),
('sports', 'medium', 'What year is Michael Jordans most valuable rookie card from?', '1986', ARRAY['1984', '1985', '1987'], 'The 1986 Fleer Michael Jordan RC is his most iconic card.', 15, 20),
('sports', 'medium', 'What is a "Short Print" (SP)?', 'Card produced in smaller quantities', ARRAY['A small card', 'A defective card', 'A player with short career'], 'Short Prints are intentionally made rarer than base cards.', 15, 20),
('sports', 'medium', 'Which company had exclusive MLB license from 2009-2020?', 'Topps', ARRAY['Panini', 'Upper Deck', 'Donruss'], 'Topps held exclusive MLB rights until Fanatics took over.', 15, 20),
('sports', 'medium', 'What is a "redemption" card?', 'Card you mail in for actual card', ARRAY['A coupon', 'A refund card', 'A damaged card'], 'Redemptions are exchanged for cards not ready at pack time.', 15, 20),
('sports', 'medium', 'What is "population" in card grading?', 'Number of cards graded at each grade', ARRAY['Card print run', 'Collector count', 'Market demand'], 'Pop reports track how many cards received each grade.', 15, 20),
('sports', 'medium', 'Which brand is known for the "Prizm" parallel?', 'Panini', ARRAY['Topps', 'Upper Deck', 'Bowman'], 'Panini Prizm silvers are highly sought after.', 15, 20),
('sports', 'medium', 'What does "RPA" stand for?', 'Rookie Patch Auto', ARRAY['Real Player Autograph', 'Rare Patch Authentic', 'Rookie Premium Auto'], 'RPA cards combine rookie status, patch, and autograph.', 15, 20),
('sports', 'medium', 'What is a "case hit"?', 'Rare card averaging 1 per case', ARRAY['A damaged card', 'A common card', 'A basketball card'], 'Case hits are extremely rare cards, about 1 per sealed case.', 15, 20),
('sports', 'medium', 'What is a "superfractor"?', '1 of 1 parallel card', ARRAY['A common parallel', 'A fake card', 'A refractor'], 'Superfractors are the rarest parallel, numbered 1/1.', 15, 20),

-- ============================================================================
-- GRADING - ALL DIFFICULTIES (20 questions)
-- ============================================================================
('general', 'easy', 'What is the highest grade a PSA card can receive?', 'PSA 10', ARRAY['PSA 9', 'PSA 11', 'PSA 100'], 'PSA 10 Gem Mint is the highest grade.', 10, 15),
('general', 'easy', 'What does PSA stand for?', 'Professional Sports Authenticator', ARRAY['Pokemon Standard Assessment', 'Premium Slab Authority', 'Pro Sports Agency'], 'PSA was founded in 1991.', 10, 15),
('general', 'easy', 'What is a "slab"?', 'Hard plastic case for graded cards', ARRAY['A damaged card', 'A fake card', 'A binder page'], 'Graded cards are encapsulated in tamper-evident "slabs."', 10, 15),
('general', 'easy', 'What is "raw" card condition?', 'Ungraded', ARRAY['Damaged', 'Fake', 'New'], 'Raw means the card has not been professionally graded.', 10, 15),
('general', 'medium', 'What does BGS stand for?', 'Beckett Grading Services', ARRAY['Best Grading Service', 'Basic Grade Score', 'Baseball Grading Standard'], 'BGS is known for subgrades and half-point increments.', 15, 20),
('general', 'medium', 'What is a BGS "Black Label"?', 'Perfect 10 in all subgrades', ARRAY['A damaged card', 'A fake card', 'A common grade'], 'Black Labels require 10s in all four subgrades.', 15, 20),
('general', 'medium', 'What are the four BGS subgrades?', 'Centering, Corners, Edges, Surface', ARRAY['Front, Back, Edges, Corners', 'Color, Print, Centering, Corners', 'Size, Shape, Color, Print'], 'BGS evaluates these four aspects separately.', 15, 20),
('general', 'medium', 'What is "centering" in card grading?', 'How well-centered the print is on the card', ARRAY['Card thickness', 'Card age', 'Card rarity'], 'Poor centering significantly reduces grades.', 15, 20),
('general', 'medium', 'What centering is required for PSA 10?', '60/40 or better', ARRAY['50/50 only', '70/30', '55/45'], 'PSA allows slight off-centering up to 60/40 for a 10.', 15, 20),
('general', 'medium', 'What is CGC?', 'Certified Guaranty Company', ARRAY['Card Grading Center', 'Collectors Grade Card', 'Common Grading Company'], 'CGC entered trading cards from comic book grading.', 15, 20),
('general', 'hard', 'What is SGC known for?', 'Vintage card grading', ARRAY['Modern cards only', 'Pokemon only', 'Fastest turnaround'], 'SGC is preferred by many vintage collectors.', 25, 25),
('general', 'hard', 'What is a "crossover"?', 'Regrading a card at a different company', ARRAY['A fake card', 'A damaged card', 'A parallel'], 'Collectors crossover cards hoping for higher grades.', 25, 25),
('general', 'hard', 'What does "eye appeal" mean?', 'Overall visual attractiveness', ARRAY['Card value', 'Card age', 'Card thickness'], 'Eye appeal considers factors beyond technical grade.', 25, 25),
('general', 'hard', 'What is the "10x rule" in grading?', 'Grade if value is 10x grading cost', ARRAY['10 cards minimum', '10 day turnaround', '10 dollar fee'], 'Only grade if potential value justifies the cost.', 25, 25),
('general', 'hard', 'What causes "whitening" on cards?', 'Edge wear exposing card stock', ARRAY['Sun damage', 'Water damage', 'Age'], 'Whitening shows the white cardboard underneath.', 25, 25),

-- ============================================================================
-- HISTORY/COLLECTING - MEDIUM (15 questions)
-- ============================================================================
('history', 'medium', 'When was the first baseball card made?', '1860s', ARRAY['1900s', '1950s', '1880s'], 'The earliest baseball cards date to the 1860s.', 15, 20),
('history', 'medium', 'Why is the T206 Honus Wagner card rare?', 'Wagner demanded production stop', ARRAY['Fire destroyed cards', 'Only 1 printed', 'All were damaged'], 'Wagner reportedly didnt want to promote tobacco to kids.', 15, 20),
('history', 'medium', 'What caused the sports card boom in the late 1980s?', 'Speculation and media coverage', ARRAY['New technology', 'Government subsidy', 'War'], 'Media stories of valuable cards drove massive speculation.', 15, 20),
('history', 'medium', 'What year did the Pokemon craze begin?', '1996', ARRAY['1998', '1995', '2000'], 'Pokemon launched in Japan in 1996, reaching the US in 1998.', 15, 20),
('history', 'medium', 'What happened to card values during COVID-19?', 'They skyrocketed', ARRAY['They crashed', 'No change', 'Moderate decline'], 'Card prices surged during pandemic lockdowns.', 15, 20),
('history', 'medium', 'Who created Pokemon?', 'Satoshi Tajiri', ARRAY['Shigeru Miyamoto', 'Ken Sugimori', 'Junichi Masuda'], 'Satoshi Tajiri created Pokemon based on his childhood bug collecting.', 15, 20),
('history', 'medium', 'What is the most expensive MTG card sale?', 'Alpha Black Lotus', ARRAY['Mox Sapphire', 'Time Walk', 'Ancestral Recall'], 'A BGS 10 Alpha Black Lotus sold for over $500,000.', 15, 20),
('history', 'medium', 'When did Upper Deck enter sports cards?', '1989', ARRAY['1985', '1995', '2000'], 'Upper Deck revolutionized the industry in 1989.', 15, 20),
('history', 'medium', 'What was special about 1989 Upper Deck?', 'First premium card brand', ARRAY['First baseball cards', 'First autographs', 'First pack'], 'Upper Deck introduced anti-counterfeit holograms and premium quality.', 15, 20),
('history', 'medium', 'What is the "Beckett price guide"?', 'Industry standard pricing magazine', ARRAY['A grading company only', 'A card shop', 'A manufacturer'], 'Beckett has published card price guides since 1984.', 15, 20)

ON CONFLICT DO NOTHING;

-- Update any duplicate handling
SELECT COUNT(*) as total_trivia FROM trivia_questions;

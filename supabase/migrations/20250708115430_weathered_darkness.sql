/*
  # Update curriculum structure for detailed units and lessons

  1. Changes
    - Update existing curriculum data to use arrays for units and lessons
    - Add isPracticeBook flag for practice books
    - Maintain backward compatibility

  2. Data Updates
    - Convert existing curriculum to new format with detailed units and lessons
    - Mark practice books appropriately
*/

-- Update the curriculum configuration with new structure
UPDATE admin_settings 
SET setting_value = '{
  "level1": {
    "id": "level1",
    "name": "Level 1",
    "books": [
      {
        "id": "l1b1",
        "name": "All About Me",
        "description": "Self-awareness and identity",
        "units": ["Introduction to Self", "My Body", "My Feelings", "My Preferences"],
        "lessons": ["Who Am I?", "My Name Story", "Body Parts", "Healthy Habits", "Happy Feelings", "Sad Feelings", "Angry Feelings", "Excited Feelings", "Favorite Colors", "Favorite Foods", "Favorite Activities", "My Dreams"]
      },
      {
        "id": "l1b2",
        "name": "My Family",
        "description": "Family relationships and roles",
        "units": ["Family Members", "Family Roles", "Family Traditions", "Family Love"],
        "lessons": ["Mom and Dad", "Brothers and Sisters", "Grandparents", "Extended Family", "What Mom Does", "What Dad Does", "Helping at Home", "Family Rules", "Special Celebrations", "Family Stories", "Family Photos", "Family Hugs"]
      },
      {
        "id": "l1b3",
        "name": "Community Helpers",
        "description": "People in our community",
        "units": ["Safety Helpers", "Health Helpers", "Service Helpers", "Education Helpers", "Transportation Helpers"],
        "lessons": ["Police Officers", "Firefighters", "Doctors", "Nurses", "Dentists", "Teachers", "Librarians", "Mail Carriers", "Store Clerks", "Bus Drivers", "Construction Workers", "Farmers"]
      },
      {
        "id": "l1b4",
        "name": "Seasons & Weather",
        "description": "Understanding weather patterns",
        "units": ["Spring Weather", "Summer Weather", "Fall Weather", "Winter Weather"],
        "lessons": ["Sunny Days", "Rainy Days", "Cloudy Days", "Windy Days", "Hot Weather", "Cold Weather", "Snow and Ice", "Storms", "Rainbow Colors", "Weather Clothes", "Seasonal Activities", "Weather Safety"]
      },
      {
        "id": "l1b5",
        "name": "Animals & Habitats",
        "description": "Animal homes and behaviors",
        "units": ["Farm Animals", "Wild Animals", "Ocean Animals", "Forest Animals", "Desert Animals", "Arctic Animals"],
        "lessons": ["Cows and Horses", "Pigs and Chickens", "Lions and Tigers", "Elephants and Giraffes", "Fish and Dolphins", "Whales and Sharks", "Bears and Deer", "Birds and Squirrels", "Camels and Lizards", "Snakes and Scorpions", "Polar Bears", "Penguins and Seals"]
      },
      {
        "id": "l1b6",
        "name": "Growing Things",
        "description": "Plants and growth cycles",
        "units": ["Seeds and Sprouts", "Flowers and Trees", "Fruits and Vegetables", "Plant Care"],
        "lessons": ["Planting Seeds", "Watering Plants", "Sunlight Needs", "Growing Tall", "Beautiful Flowers", "Strong Trees", "Tasty Fruits", "Healthy Vegetables", "Garden Tools", "Plant Friends", "Harvest Time", "Sharing Plants"]
      },
      {
        "id": "l1p1",
        "name": "Practice Book - English",
        "description": "English language practice exercises",
        "units": ["Letter Recognition", "Phonics Practice", "Vocabulary Building"],
        "lessons": ["Alphabet Tracing", "Letter Sounds", "Word Formation", "Reading Comprehension", "Writing Practice"],
        "isPracticeBook": true
      },
      {
        "id": "l1p2",
        "name": "Practice Book - Science",
        "description": "Science concepts practice",
        "units": ["Observation Skills", "Simple Experiments", "Nature Study"],
        "lessons": ["Looking Closely", "Asking Questions", "Making Predictions", "Recording Results", "Drawing Conclusions"],
        "isPracticeBook": true
      },
      {
        "id": "l1p3",
        "name": "Practice Book - Maths",
        "description": "Mathematics practice exercises",
        "units": ["Number Recognition", "Counting Practice", "Shape Identification"],
        "lessons": ["Numbers 1-10", "Counting Objects", "Basic Shapes", "Size Comparison", "Pattern Recognition"],
        "isPracticeBook": true
      }
    ]
  }
}'::jsonb
WHERE id = 'curriculum_config' AND setting_type = 'curriculum';

-- If the record doesn't exist, insert it
INSERT INTO admin_settings (id, setting_type, setting_value)
SELECT 'curriculum_config', 'curriculum', '{
  "level1": {
    "id": "level1",
    "name": "Level 1",
    "books": [
      {
        "id": "l1b1",
        "name": "All About Me",
        "description": "Self-awareness and identity",
        "units": ["Introduction to Self", "My Body", "My Feelings", "My Preferences"],
        "lessons": ["Who Am I?", "My Name Story", "Body Parts", "Healthy Habits", "Happy Feelings", "Sad Feelings", "Angry Feelings", "Excited Feelings", "Favorite Colors", "Favorite Foods", "Favorite Activities", "My Dreams"]
      }
    ]
  }
}'::jsonb
WHERE NOT EXISTS (
  SELECT 1 FROM admin_settings 
  WHERE id = 'curriculum_config' AND setting_type = 'curriculum'
);
/*
  # Add Level 2 and Level 3 to curriculum database

  1. Updates
    - Add complete Level 2 curriculum (Ages 4-5) with 5 books and 29 lessons
    - Add complete Level 3 curriculum (Ages 5-6) with 6 books and 30 lessons
    - Total curriculum now includes 3 levels, 20 books, and 156 lessons

  2. Level 2 Content
    - My Community (community awareness)
    - Transportation & Travel (vehicles and safety)
    - Science Discoveries (basic scientific concepts)
    - Practice Book - Advanced English
    - Practice Book - Advanced Math

  3. Level 3 Content
    - World Around Us (geography and cultures)
    - History & Time (past, present, future concepts)
    - Advanced Science (earth, space, living systems)
    - Creative Arts (art, music, movement)
    - Practice Book - Pre-Reading
    - Practice Book - Pre-Math
*/

-- Update the curriculum configuration with all three levels
UPDATE admin_settings 
SET setting_value = '[
  {
    "id": "level1",
    "name": "Level 1 (Ages 3-4)",
    "books": [
      {
        "id": "l1b1",
        "name": "All About Me",
        "description": "Self-awareness and identity development",
        "isbn": "978-1-234567-01-1",
        "hyperlink": "https://example.com/all-about-me",
        "units": [
          {
            "id": "unit1",
            "name": "Introduction to Self",
            "lessons": [
              {
                "id": "lesson1",
                "name": "Who Am I?",
                "objective": "Students will identify their unique characteristics and understand their individuality"
              },
              {
                "id": "lesson2",
                "name": "My Name Story",
                "objective": "Students will learn about the meaning and importance of their names"
              },
              {
                "id": "lesson3",
                "name": "My Special Qualities",
                "objective": "Students will recognize and express their positive traits and abilities"
              }
            ]
          },
          {
            "id": "unit2",
            "name": "My Body",
            "lessons": [
              {
                "id": "lesson4",
                "name": "Body Parts",
                "objective": "Students will identify and name major body parts and their functions"
              },
              {
                "id": "lesson5",
                "name": "Healthy Habits",
                "objective": "Students will understand basic hygiene and health practices"
              },
              {
                "id": "lesson6",
                "name": "Taking Care of Myself",
                "objective": "Students will learn self-care routines and personal responsibility"
              }
            ]
          },
          {
            "id": "unit3",
            "name": "My Feelings",
            "lessons": [
              {
                "id": "lesson7",
                "name": "Happy Feelings",
                "objective": "Students will identify situations that make them happy and express joy appropriately"
              },
              {
                "id": "lesson8",
                "name": "Sad Feelings",
                "objective": "Students will recognize sadness and learn healthy ways to cope with disappointment"
              },
              {
                "id": "lesson9",
                "name": "Angry Feelings",
                "objective": "Students will understand anger and practice appropriate ways to express frustration"
              },
              {
                "id": "lesson10",
                "name": "Managing Emotions",
                "objective": "Students will develop strategies for emotional regulation and self-control"
              }
            ]
          },
          {
            "id": "unit4",
            "name": "My Preferences",
            "lessons": [
              {
                "id": "lesson11",
                "name": "Favorite Colors",
                "objective": "Students will identify and express their color preferences while learning color names"
              },
              {
                "id": "lesson12",
                "name": "Favorite Foods",
                "objective": "Students will discuss food preferences and learn about healthy eating choices"
              },
              {
                "id": "lesson13",
                "name": "Favorite Activities",
                "objective": "Students will share their preferred activities and understand different interests"
              },
              {
                "id": "lesson14",
                "name": "My Dreams and Goals",
                "objective": "Students will express their aspirations and understand the concept of future planning"
              }
            ]
          }
        ]
      },
      {
        "id": "l1b2",
        "name": "My Family",
        "description": "Family relationships, roles, and traditions",
        "isbn": "978-1-234567-02-2",
        "hyperlink": "https://example.com/my-family",
        "units": [
          {
            "id": "unit5",
            "name": "Family Members",
            "lessons": [
              {
                "id": "lesson15",
                "name": "Mom and Dad",
                "objective": "Students will understand the roles of parents and express appreciation for their care"
              },
              {
                "id": "lesson16",
                "name": "Brothers and Sisters",
                "objective": "Students will explore sibling relationships and learn about cooperation and sharing"
              },
              {
                "id": "lesson17",
                "name": "Grandparents",
                "objective": "Students will appreciate the wisdom and love of grandparents and extended family"
              },
              {
                "id": "lesson18",
                "name": "Extended Family",
                "objective": "Students will identify various family members and understand family connections"
              }
            ]
          },
          {
            "id": "unit6",
            "name": "Family Roles",
            "lessons": [
              {
                "id": "lesson19",
                "name": "What Parents Do",
                "objective": "Students will understand the responsibilities and care that parents provide"
              },
              {
                "id": "lesson20",
                "name": "Helping at Home",
                "objective": "Students will learn age-appropriate ways to contribute to family life"
              },
              {
                "id": "lesson21",
                "name": "Family Rules",
                "objective": "Students will understand the importance of family rules and expectations"
              }
            ]
          },
          {
            "id": "unit7",
            "name": "Family Traditions",
            "lessons": [
              {
                "id": "lesson22",
                "name": "Special Celebrations",
                "objective": "Students will explore family traditions and cultural celebrations"
              },
              {
                "id": "lesson23",
                "name": "Family Stories",
                "objective": "Students will appreciate family history and the importance of storytelling"
              },
              {
                "id": "lesson24",
                "name": "Creating Memories",
                "objective": "Students will understand how families create and preserve special moments"
              }
            ]
          },
          {
            "id": "unit8",
            "name": "Family Love",
            "lessons": [
              {
                "id": "lesson25",
                "name": "Showing Love",
                "objective": "Students will learn various ways families express love and affection"
              },
              {
                "id": "lesson26",
                "name": "Family Support",
                "objective": "Students will understand how families help each other through challenges"
              },
              {
                "id": "lesson27",
                "name": "Gratitude for Family",
                "objective": "Students will express appreciation for their family members and relationships"
              }
            ]
          }
        ]
      },
      {
        "id": "l1b3",
        "name": "Community Helpers",
        "description": "People who help in our community and their important roles",
        "isbn": "978-1-234567-03-3",
        "hyperlink": "https://example.com/community-helpers",
        "units": [
          {
            "id": "unit9",
            "name": "Safety Helpers",
            "lessons": [
              {
                "id": "lesson28",
                "name": "Police Officers",
                "objective": "Students will understand how police officers keep communities safe and help people"
              },
              {
                "id": "lesson29",
                "name": "Firefighters",
                "objective": "Students will learn about fire safety and the brave work of firefighters"
              },
              {
                "id": "lesson30",
                "name": "Emergency Workers",
                "objective": "Students will identify various emergency responders and when to call for help"
              }
            ]
          },
          {
            "id": "unit10",
            "name": "Health Helpers",
            "lessons": [
              {
                "id": "lesson31",
                "name": "Doctors and Nurses",
                "objective": "Students will understand how medical professionals help keep us healthy"
              },
              {
                "id": "lesson32",
                "name": "Dentists",
                "objective": "Students will learn about dental health and overcoming fear of dental visits"
              },
              {
                "id": "lesson33",
                "name": "Veterinarians",
                "objective": "Students will explore how veterinarians care for animals and pets"
              }
            ]
          },
          {
            "id": "unit11",
            "name": "Service Helpers",
            "lessons": [
              {
                "id": "lesson34",
                "name": "Mail Carriers",
                "objective": "Students will understand how mail is delivered and the importance of communication"
              },
              {
                "id": "lesson35",
                "name": "Store Workers",
                "objective": "Students will appreciate the work of retail employees and practice polite shopping behavior"
              },
              {
                "id": "lesson36",
                "name": "Sanitation Workers",
                "objective": "Students will understand the importance of keeping communities clean"
              }
            ]
          },
          {
            "id": "unit12",
            "name": "Education and Transportation",
            "lessons": [
              {
                "id": "lesson37",
                "name": "Teachers and Librarians",
                "objective": "Students will appreciate educators and the importance of learning"
              },
              {
                "id": "lesson38",
                "name": "Bus Drivers",
                "objective": "Students will learn about transportation safety and showing respect to drivers"
              },
              {
                "id": "lesson39",
                "name": "Construction Workers",
                "objective": "Students will understand how buildings and roads are constructed"
              }
            ]
          }
        ]
      },
      {
        "id": "l1b4",
        "name": "Seasons & Weather",
        "description": "Understanding weather patterns and seasonal changes",
        "isbn": "978-1-234567-04-4",
        "hyperlink": "https://example.com/seasons-weather",
        "units": [
          {
            "id": "unit13",
            "name": "Spring Weather",
            "lessons": [
              {
                "id": "lesson40",
                "name": "Spring Awakening",
                "objective": "Students will observe signs of spring and understand seasonal transitions"
              },
              {
                "id": "lesson41",
                "name": "Rain and Growth",
                "objective": "Students will understand how spring rain helps plants grow"
              },
              {
                "id": "lesson42",
                "name": "Spring Animals",
                "objective": "Students will learn about animal behavior changes in spring"
              }
            ]
          },
          {
            "id": "unit14",
            "name": "Summer Weather",
            "lessons": [
              {
                "id": "lesson43",
                "name": "Hot and Sunny Days",
                "objective": "Students will understand summer weather characteristics and sun safety"
              },
              {
                "id": "lesson44",
                "name": "Summer Activities",
                "objective": "Students will explore appropriate summer activities and clothing choices"
              },
              {
                "id": "lesson45",
                "name": "Staying Cool",
                "objective": "Students will learn strategies for staying comfortable in hot weather"
              }
            ]
          },
          {
            "id": "unit15",
            "name": "Fall Weather",
            "lessons": [
              {
                "id": "lesson46",
                "name": "Changing Leaves",
                "objective": "Students will observe and understand why leaves change colors in autumn"
              },
              {
                "id": "lesson47",
                "name": "Harvest Time",
                "objective": "Students will learn about fall harvests and seasonal foods"
              },
              {
                "id": "lesson48",
                "name": "Preparing for Winter",
                "objective": "Students will understand how people and animals prepare for colder weather"
              }
            ]
          },
          {
            "id": "unit16",
            "name": "Winter Weather",
            "lessons": [
              {
                "id": "lesson49",
                "name": "Snow and Ice",
                "objective": "Students will explore the properties of snow and ice and winter safety"
              },
              {
                "id": "lesson50",
                "name": "Staying Warm",
                "objective": "Students will learn about appropriate winter clothing and heating"
              },
              {
                "id": "lesson51",
                "name": "Winter Animals",
                "objective": "Students will discover how animals survive and adapt during winter"
              }
            ]
          }
        ]
      },
      {
        "id": "l1b5",
        "name": "Animals & Habitats",
        "description": "Animal homes, behaviors, and adaptations",
        "isbn": "978-1-234567-05-5",
        "hyperlink": "https://example.com/animals-habitats",
        "units": [
          {
            "id": "unit17",
            "name": "Farm Animals",
            "lessons": [
              {
                "id": "lesson52",
                "name": "Cows and Horses",
                "objective": "Students will learn about large farm animals and their contributions to farming"
              },
              {
                "id": "lesson53",
                "name": "Pigs and Chickens",
                "objective": "Students will understand the care and products provided by smaller farm animals"
              },
              {
                "id": "lesson54",
                "name": "Farm Animal Care",
                "objective": "Students will learn about responsible animal care and farming practices"
              }
            ]
          },
          {
            "id": "unit18",
            "name": "Wild Animals",
            "lessons": [
              {
                "id": "lesson55",
                "name": "Big Cats",
                "objective": "Students will explore the characteristics and habitats of lions, tigers, and other big cats"
              },
              {
                "id": "lesson56",
                "name": "Elephants and Giraffes",
                "objective": "Students will learn about large African animals and their unique adaptations"
              },
              {
                "id": "lesson57",
                "name": "Monkeys and Apes",
                "objective": "Students will discover the intelligence and social behavior of primates"
              }
            ]
          },
          {
            "id": "unit19",
            "name": "Ocean Animals",
            "lessons": [
              {
                "id": "lesson58",
                "name": "Fish and Dolphins",
                "objective": "Students will explore marine life and ocean ecosystems"
              },
              {
                "id": "lesson59",
                "name": "Whales and Sharks",
                "objective": "Students will learn about large ocean predators and their important roles"
              },
              {
                "id": "lesson60",
                "name": "Ocean Conservation",
                "objective": "Students will understand the importance of protecting ocean environments"
              }
            ]
          },
          {
            "id": "unit20",
            "name": "Forest and Arctic Animals",
            "lessons": [
              {
                "id": "lesson61",
                "name": "Bears and Deer",
                "objective": "Students will learn about forest animals and their seasonal behaviors"
              },
              {
                "id": "lesson62",
                "name": "Birds and Squirrels",
                "objective": "Students will observe common woodland animals and their adaptations"
              },
              {
                "id": "lesson63",
                "name": "Polar Animals",
                "objective": "Students will discover how animals survive in extremely cold environments"
              }
            ]
          }
        ]
      },
      {
        "id": "l1b6",
        "name": "Growing Things",
        "description": "Plants, growth cycles, and gardening",
        "isbn": "978-1-234567-06-6",
        "hyperlink": "https://example.com/growing-things",
        "units": [
          {
            "id": "unit21",
            "name": "Seeds and Sprouts",
            "lessons": [
              {
                "id": "lesson64",
                "name": "Planting Seeds",
                "objective": "Students will understand the basic process of planting and germination"
              },
              {
                "id": "lesson65",
                "name": "What Seeds Need",
                "objective": "Students will learn about the requirements for plant growth: water, sunlight, and soil"
              },
              {
                "id": "lesson66",
                "name": "Watching Growth",
                "objective": "Students will observe and document plant growth over time"
              }
            ]
          },
          {
            "id": "unit22",
            "name": "Flowers and Trees",
            "lessons": [
              {
                "id": "lesson67",
                "name": "Beautiful Flowers",
                "objective": "Students will identify different types of flowers and their parts"
              },
              {
                "id": "lesson68",
                "name": "Strong Trees",
                "objective": "Students will learn about tree growth, parts, and their importance to the environment"
              },
              {
                "id": "lesson69",
                "name": "Seasonal Changes",
                "objective": "Students will observe how plants change throughout the seasons"
              }
            ]
          },
          {
            "id": "unit23",
            "name": "Fruits and Vegetables",
            "lessons": [
              {
                "id": "lesson70",
                "name": "Tasty Fruits",
                "objective": "Students will identify various fruits and understand their nutritional benefits"
              },
              {
                "id": "lesson71",
                "name": "Healthy Vegetables",
                "objective": "Students will explore different vegetables and their role in a healthy diet"
              },
              {
                "id": "lesson72",
                "name": "From Garden to Table",
                "objective": "Students will understand the journey of food from growing to eating"
              }
            ]
          },
          {
            "id": "unit24",
            "name": "Plant Care and Gardening",
            "lessons": [
              {
                "id": "lesson73",
                "name": "Garden Tools",
                "objective": "Students will identify gardening tools and learn their safe use"
              },
              {
                "id": "lesson74",
                "name": "Caring for Plants",
                "objective": "Students will develop responsibility through plant care activities"
              },
              {
                "id": "lesson75",
                "name": "Sharing Our Harvest",
                "objective": "Students will understand the joy of sharing and community gardening"
              }
            ]
          }
        ]
      },
      {
        "id": "l1p1",
        "name": "Practice Book - English Language Arts",
        "description": "English language practice exercises and activities",
        "isbn": "978-1-234567-07-7",
        "isPracticeBook": true,
        "units": [
          {
            "id": "unit25",
            "name": "Letter Recognition",
            "lessons": [
              {
                "id": "lesson76",
                "name": "Alphabet Tracing",
                "objective": "Students will practice proper letter formation through tracing activities"
              },
              {
                "id": "lesson77",
                "name": "Letter Identification",
                "objective": "Students will recognize and name all letters of the alphabet"
              },
              {
                "id": "lesson78",
                "name": "Upper and Lowercase",
                "objective": "Students will distinguish between uppercase and lowercase letters"
              }
            ]
          },
          {
            "id": "unit26",
            "name": "Phonics Practice",
            "lessons": [
              {
                "id": "lesson79",
                "name": "Letter Sounds",
                "objective": "Students will associate letters with their corresponding sounds"
              },
              {
                "id": "lesson80",
                "name": "Beginning Sounds",
                "objective": "Students will identify initial sounds in words"
              },
              {
                "id": "lesson81",
                "name": "Rhyming Words",
                "objective": "Students will recognize and create rhyming word patterns"
              }
            ]
          },
          {
            "id": "unit27",
            "name": "Vocabulary Building",
            "lessons": [
              {
                "id": "lesson82",
                "name": "Word Formation",
                "objective": "Students will combine letters to form simple words"
              },
              {
                "id": "lesson83",
                "name": "Picture-Word Matching",
                "objective": "Students will connect visual representations with written words"
              },
              {
                "id": "lesson84",
                "name": "Reading Comprehension",
                "objective": "Students will understand simple sentences and short stories"
              }
            ]
          }
        ]
      },
      {
        "id": "l1p2",
        "name": "Practice Book - Science Exploration",
        "description": "Science concepts practice and hands-on activities",
        "isbn": "978-1-234567-08-8",
        "isPracticeBook": true,
        "units": [
          {
            "id": "unit28",
            "name": "Observation Skills",
            "lessons": [
              {
                "id": "lesson85",
                "name": "Using Our Senses",
                "objective": "Students will use all five senses to explore and describe objects"
              },
              {
                "id": "lesson86",
                "name": "Looking Closely",
                "objective": "Students will develop detailed observation skills using magnifying tools"
              },
              {
                "id": "lesson87",
                "name": "Recording Observations",
                "objective": "Students will document their observations through drawings and simple words"
              }
            ]
          },
          {
            "id": "unit29",
            "name": "Simple Experiments",
            "lessons": [
              {
                "id": "lesson88",
                "name": "Asking Questions",
                "objective": "Students will formulate scientific questions about the world around them"
              },
              {
                "id": "lesson89",
                "name": "Making Predictions",
                "objective": "Students will hypothesize outcomes before conducting experiments"
              },
              {
                "id": "lesson90",
                "name": "Testing Ideas",
                "objective": "Students will conduct simple, safe experiments to test their predictions"
              }
            ]
          },
          {
            "id": "unit30",
            "name": "Nature Study",
            "lessons": [
              {
                "id": "lesson91",
                "name": "Weather Watching",
                "objective": "Students will observe and record daily weather patterns"
              },
              {
                "id": "lesson92",
                "name": "Plant Growth",
                "objective": "Students will monitor and document plant growth over time"
              },
              {
                "id": "lesson93",
                "name": "Animal Behavior",
                "objective": "Students will observe and describe animal behaviors in their environment"
              }
            ]
          }
        ]
      },
      {
        "id": "l1p3",
        "name": "Practice Book - Mathematics",
        "description": "Mathematics practice exercises and problem-solving",
        "isbn": "978-1-234567-09-9",
        "isPracticeBook": true,
        "units": [
          {
            "id": "unit31",
            "name": "Number Recognition",
            "lessons": [
              {
                "id": "lesson94",
                "name": "Numbers 1-10",
                "objective": "Students will recognize, write, and understand the value of numbers 1-10"
              },
              {
                "id": "lesson95",
                "name": "Number Order",
                "objective": "Students will arrange numbers in correct sequence and understand number relationships"
              },
              {
                "id": "lesson96",
                "name": "Number Matching",
                "objective": "Students will match numerals with corresponding quantities"
              }
            ]
          },
          {
            "id": "unit32",
            "name": "Counting Practice",
            "lessons": [
              {
                "id": "lesson97",
                "name": "Counting Objects",
                "objective": "Students will count concrete objects accurately up to 20"
              },
              {
                "id": "lesson98",
                "name": "One-to-One Correspondence",
                "objective": "Students will understand that each object counted corresponds to one number"
              },
              {
                "id": "lesson99",
                "name": "Skip Counting",
                "objective": "Students will practice counting by 2s, 5s, and 10s"
              }
            ]
          },
          {
            "id": "unit33",
            "name": "Shape and Pattern Recognition",
            "lessons": [
              {
                "id": "lesson100",
                "name": "Basic Shapes",
                "objective": "Students will identify and name circles, squares, triangles, and rectangles"
              },
              {
                "id": "lesson101",
                "name": "Shape Attributes",
                "objective": "Students will describe shapes by their properties (sides, corners, curves)"
              },
              {
                "id": "lesson102",
                "name": "Pattern Recognition",
                "objective": "Students will identify, continue, and create simple patterns"
              }
            ]
          }
        ]
      }
    ]
  },
  {
    "id": "level2",
    "name": "Level 2 (Ages 4-5)",
    "books": [
      {
        "id": "l2b1",
        "name": "My Community",
        "description": "Understanding neighborhoods and community life",
        "isbn": "978-1-234567-10-0",
        "hyperlink": "https://example.com/my-community",
        "units": [
          {
            "id": "unit34",
            "name": "Where I Live",
            "lessons": [
              {
                "id": "lesson103",
                "name": "My Neighborhood",
                "objective": "Students will identify features of their neighborhood and understand community layout"
              },
              {
                "id": "lesson104",
                "name": "Different Types of Homes",
                "objective": "Students will explore various housing types and understand that families live differently"
              },
              {
                "id": "lesson105",
                "name": "Community Spaces",
                "objective": "Students will identify parks, libraries, and other shared community spaces"
              }
            ]
          },
          {
            "id": "unit35",
            "name": "Community Workers",
            "lessons": [
              {
                "id": "lesson106",
                "name": "People Who Help Us",
                "objective": "Students will recognize various community workers and their contributions"
              },
              {
                "id": "lesson107",
                "name": "Visiting Community Places",
                "objective": "Students will understand the purpose of different community buildings and services"
              },
              {
                "id": "lesson108",
                "name": "Being a Good Neighbor",
                "objective": "Students will learn about community responsibility and helping others"
              }
            ]
          }
        ]
      },
      {
        "id": "l2b2",
        "name": "Transportation & Travel",
        "description": "Vehicles, transportation methods, and travel safety",
        "isbn": "978-1-234567-11-1",
        "hyperlink": "https://example.com/transportation-travel",
        "units": [
          {
            "id": "unit36",
            "name": "Land Transportation",
            "lessons": [
              {
                "id": "lesson109",
                "name": "Cars and Trucks",
                "objective": "Students will identify different types of vehicles and their purposes"
              },
              {
                "id": "lesson110",
                "name": "Buses and Trains",
                "objective": "Students will understand public transportation and its benefits"
              },
              {
                "id": "lesson111",
                "name": "Bicycles and Walking",
                "objective": "Students will learn about eco-friendly transportation and exercise"
              }
            ]
          },
          {
            "id": "unit37",
            "name": "Water and Air Transportation",
            "lessons": [
              {
                "id": "lesson112",
                "name": "Boats and Ships",
                "objective": "Students will explore water transportation and maritime safety"
              },
              {
                "id": "lesson113",
                "name": "Airplanes and Helicopters",
                "objective": "Students will understand air travel and aviation basics"
              },
              {
                "id": "lesson114",
                "name": "Transportation Safety",
                "objective": "Students will learn safety rules for different modes of transportation"
              }
            ]
          }
        ]
      },
      {
        "id": "l2b3",
        "name": "Science Discoveries",
        "description": "Basic scientific concepts and exploration",
        "isbn": "978-1-234567-12-2",
        "hyperlink": "https://example.com/science-discoveries",
        "units": [
          {
            "id": "unit38",
            "name": "Matter and Materials",
            "lessons": [
              {
                "id": "lesson115",
                "name": "Solids, Liquids, and Gases",
                "objective": "Students will identify and classify different states of matter"
              },
              {
                "id": "lesson116",
                "name": "Hot and Cold",
                "objective": "Students will understand temperature and its effects on materials"
              },
              {
                "id": "lesson117",
                "name": "Mixing and Changing",
                "objective": "Students will observe simple chemical and physical changes"
              }
            ]
          },
          {
            "id": "unit39",
            "name": "Forces and Motion",
            "lessons": [
              {
                "id": "lesson118",
                "name": "Push and Pull",
                "objective": "Students will understand basic forces and how they affect objects"
              },
              {
                "id": "lesson119",
                "name": "Fast and Slow",
                "objective": "Students will explore speed and motion through hands-on activities"
              },
              {
                "id": "lesson120",
                "name": "Gravity and Balance",
                "objective": "Students will discover gravity and balance through experimentation"
              }
            ]
          }
        ]
      },
      {
        "id": "l2p1",
        "name": "Practice Book - Advanced English",
        "description": "Advanced English language skills and reading",
        "isbn": "978-1-234567-13-3",
        "isPracticeBook": true,
        "units": [
          {
            "id": "unit40",
            "name": "Reading Skills",
            "lessons": [
              {
                "id": "lesson121",
                "name": "Sight Words",
                "objective": "Students will recognize and read common sight words automatically"
              },
              {
                "id": "lesson122",
                "name": "Simple Sentences",
                "objective": "Students will read and understand simple sentence structures"
              },
              {
                "id": "lesson123",
                "name": "Story Comprehension",
                "objective": "Students will demonstrate understanding of simple stories"
              }
            ]
          }
        ]
      },
      {
        "id": "l2p2",
        "name": "Practice Book - Advanced Math",
        "description": "Advanced mathematics concepts and problem solving",
        "isbn": "978-1-234567-14-4",
        "isPracticeBook": true,
        "units": [
          {
            "id": "unit41",
            "name": "Advanced Counting",
            "lessons": [
              {
                "id": "lesson124",
                "name": "Numbers 11-20",
                "objective": "Students will recognize and work with numbers beyond 10"
              },
              {
                "id": "lesson125",
                "name": "Simple Addition",
                "objective": "Students will understand basic addition concepts with manipulatives"
              },
              {
                "id": "lesson126",
                "name": "Simple Subtraction",
                "objective": "Students will understand basic subtraction concepts"
              }
            ]
          }
        ]
      }
    ]
  },
  {
    "id": "level3",
    "name": "Level 3 (Ages 5-6)",
    "books": [
      {
        "id": "l3b1",
        "name": "World Around Us",
        "description": "Geography, cultures, and global awareness",
        "isbn": "978-1-234567-20-0",
        "hyperlink": "https://example.com/world-around-us",
        "units": [
          {
            "id": "unit42",
            "name": "Maps and Places",
            "lessons": [
              {
                "id": "lesson127",
                "name": "Reading Simple Maps",
                "objective": "Students will understand basic map symbols and directions"
              },
              {
                "id": "lesson128",
                "name": "Our Country",
                "objective": "Students will learn about their country and its characteristics"
              },
              {
                "id": "lesson129",
                "name": "Other Countries",
                "objective": "Students will explore different countries and cultures around the world"
              }
            ]
          },
          {
            "id": "unit43",
            "name": "Cultures and Traditions",
            "lessons": [
              {
                "id": "lesson130",
                "name": "Different Languages",
                "objective": "Students will appreciate linguistic diversity and learn simple greetings"
              },
              {
                "id": "lesson131",
                "name": "Cultural Celebrations",
                "objective": "Students will explore various cultural festivals and traditions"
              },
              {
                "id": "lesson132",
                "name": "Foods from Around the World",
                "objective": "Students will discover different cuisines and eating customs"
              }
            ]
          }
        ]
      },
      {
        "id": "l3b2",
        "name": "History & Time",
        "description": "Understanding past, present, and future concepts",
        "isbn": "978-1-234567-21-1",
        "hyperlink": "https://example.com/history-time",
        "units": [
          {
            "id": "unit44",
            "name": "Past and Present",
            "lessons": [
              {
                "id": "lesson133",
                "name": "Long Ago and Today",
                "objective": "Students will compare life in the past with life today"
              },
              {
                "id": "lesson134",
                "name": "Family History",
                "objective": "Students will explore their family history and traditions"
              },
              {
                "id": "lesson135",
                "name": "Historical Figures",
                "objective": "Students will learn about important people from history"
              }
            ]
          },
          {
            "id": "unit45",
            "name": "Time Concepts",
            "lessons": [
              {
                "id": "lesson136",
                "name": "Days and Weeks",
                "objective": "Students will understand calendar concepts and time organization"
              },
              {
                "id": "lesson137",
                "name": "Months and Seasons",
                "objective": "Students will learn about yearly cycles and seasonal changes"
              },
              {
                "id": "lesson138",
                "name": "Telling Time",
                "objective": "Students will begin to understand clock reading and time concepts"
              }
            ]
          }
        ]
      },
      {
        "id": "l3b3",
        "name": "Advanced Science",
        "description": "Complex scientific concepts and investigations",
        "isbn": "978-1-234567-22-2",
        "hyperlink": "https://example.com/advanced-science",
        "units": [
          {
            "id": "unit46",
            "name": "Earth and Space",
            "lessons": [
              {
                "id": "lesson139",
                "name": "Our Planet Earth",
                "objective": "Students will understand Earth basic features and characteristics"
              },
              {
                "id": "lesson140",
                "name": "Sun, Moon, and Stars",
                "objective": "Students will explore basic astronomy and celestial objects"
              },
              {
                "id": "lesson141",
                "name": "Day and Night",
                "objective": "Students will understand the Earth rotation and its effects"
              }
            ]
          },
          {
            "id": "unit47",
            "name": "Living Systems",
            "lessons": [
              {
                "id": "lesson142",
                "name": "Life Cycles",
                "objective": "Students will understand how living things grow and change"
              },
              {
                "id": "lesson143",
                "name": "Food Chains",
                "objective": "Students will explore how animals and plants depend on each other"
              },
              {
                "id": "lesson144",
                "name": "Ecosystems",
                "objective": "Students will understand how living and non-living things interact"
              }
            ]
          }
        ]
      },
      {
        "id": "l3b4",
        "name": "Creative Arts",
        "description": "Art, music, and creative expression",
        "isbn": "978-1-234567-23-3",
        "hyperlink": "https://example.com/creative-arts",
        "units": [
          {
            "id": "unit48",
            "name": "Visual Arts",
            "lessons": [
              {
                "id": "lesson145",
                "name": "Colors and Painting",
                "objective": "Students will explore color theory and painting techniques"
              },
              {
                "id": "lesson146",
                "name": "Drawing and Sketching",
                "objective": "Students will develop drawing skills and artistic expression"
              },
              {
                "id": "lesson147",
                "name": "Sculpture and Crafts",
                "objective": "Students will work with three-dimensional art and crafting materials"
              }
            ]
          },
          {
            "id": "unit49",
            "name": "Music and Movement",
            "lessons": [
              {
                "id": "lesson148",
                "name": "Rhythm and Beat",
                "objective": "Students will understand musical rhythm and participate in rhythmic activities"
              },
              {
                "id": "lesson149",
                "name": "Songs and Singing",
                "objective": "Students will develop vocal skills and musical expression"
              },
              {
                "id": "lesson150",
                "name": "Dance and Movement",
                "objective": "Students will express themselves through creative movement and dance"
              }
            ]
          }
        ]
      },
      {
        "id": "l3p1",
        "name": "Practice Book - Pre-Reading",
        "description": "Advanced reading preparation and literacy skills",
        "isbn": "978-1-234567-24-4",
        "isPracticeBook": true,
        "units": [
          {
            "id": "unit50",
            "name": "Advanced Phonics",
            "lessons": [
              {
                "id": "lesson151",
                "name": "Blending Sounds",
                "objective": "Students will combine individual sounds to form words"
              },
              {
                "id": "lesson152",
                "name": "Word Families",
                "objective": "Students will recognize patterns in word families and rhyming groups"
              },
              {
                "id": "lesson153",
                "name": "Reading Fluency",
                "objective": "Students will read simple texts with increasing speed and accuracy"
              }
            ]
          }
        ]
      },
      {
        "id": "l3p2",
        "name": "Practice Book - Pre-Math",
        "description": "Advanced mathematics preparation for primary school",
        "isbn": "978-1-234567-25-5",
        "isPracticeBook": true,
        "units": [
          {
            "id": "unit51",
            "name": "Number Operations",
            "lessons": [
              {
                "id": "lesson154",
                "name": "Addition to 20",
                "objective": "Students will solve addition problems with sums up to 20"
              },
              {
                "id": "lesson155",
                "name": "Subtraction to 20",
                "objective": "Students will solve subtraction problems within 20"
              },
              {
                "id": "lesson156",
                "name": "Problem Solving",
                "objective": "Students will apply mathematical thinking to solve simple word problems"
              }
            ]
          }
        ]
      }
    ]
  }
]'::jsonb
WHERE id = 'curriculum_config' AND setting_type = 'curriculum';
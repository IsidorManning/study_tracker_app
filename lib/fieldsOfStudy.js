// This is a curated list of major academic disciplines and their subfields
// Based on UNESCO's International Standard Classification of Education (ISCED) fields
// and major academic disciplines recognized worldwide

export const fieldsOfStudy = [
  {
    category: "Natural Sciences",
    fields: [
      "Mathematics",
      "Physics",
      "Chemistry",
      "Biology",
      "Earth Sciences",
      "Astronomy",
      "Computer Science",
      "Statistics"
    ]
  },
  {
    category: "Engineering & Technology",
    fields: [
      "Mechanical Engineering",
      "Electrical Engineering",
      "Civil Engineering",
      "Chemical Engineering",
      "Computer Engineering",
      "Aerospace Engineering",
      "Biomedical Engineering",
      "Environmental Engineering",
      "Materials Science",
      "Robotics",
      "Software Engineering"
    ]
  },
  {
    category: "Social Sciences",
    fields: [
      "Economics",
      "Political Science",
      "Sociology",
      "Psychology",
      "Anthropology",
      "Geography",
      "Linguistics",
      "Education",
      "Law",
      "Business Administration",
      "Management",
      "Marketing",
      "Finance",
      "Accounting"
    ]
  },
  {
    category: "Humanities",
    fields: [
      "Philosophy",
      "History",
      "Literature",
      "Languages",
      "Classical Studies",
      "Religious Studies",
      "Art History",
      "Music",
      "Theater",
      "Film Studies",
      "Cultural Studies",
      "Archaeology"
    ]
  },
  {
    category: "Health Sciences",
    fields: [
      "Medicine",
      "Nursing",
      "Pharmacy",
      "Dentistry",
      "Veterinary Medicine",
      "Public Health",
      "Nutrition",
      "Physiotherapy",
      "Occupational Therapy",
      "Sports Medicine"
    ]
  },
  {
    category: "Agriculture & Environmental Sciences",
    fields: [
      "Agriculture",
      "Forestry",
      "Environmental Science",
      "Marine Science",
      "Meteorology",
      "Conservation",
      "Sustainable Development",
      "Food Science"
    ]
  },
  {
    category: "Arts & Design",
    fields: [
      "Fine Arts",
      "Graphic Design",
      "Industrial Design",
      "Architecture",
      "Urban Planning",
      "Fashion Design",
      "Interior Design",
      "Digital Arts",
      "Animation",
      "Game Design"
    ]
  },
  {
    category: "Interdisciplinary Fields",
    fields: [
      "Cognitive Science",
      "Neuroscience",
      "Bioinformatics",
      "Quantum Computing",
      "Nanotechnology",
      "Biotechnology",
      "Artificial Intelligence",
      "Data Science"
    ]
  }
];

// Flatten the fields for easier searching
export const allFields = fieldsOfStudy.flatMap(category => 
  category.fields.map(field => ({
    name: field,
    category: category.category
  }))
);

// Get all unique categories
export const categories = fieldsOfStudy.map(category => category.category);

// Search function to find fields matching a query
export const searchFields = (query) => {
  const searchTerm = query.toLowerCase();
  return allFields.filter(field => 
    field.name.toLowerCase().includes(searchTerm) ||
    field.category.toLowerCase().includes(searchTerm)
  );
}; 
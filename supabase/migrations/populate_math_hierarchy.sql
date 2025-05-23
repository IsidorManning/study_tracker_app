-- Insert main branches of mathematics
INSERT INTO field_hierarchy (field_category, name, description, level, parent_id) VALUES
('math', 'Algebra', 'The study of mathematical symbols and the rules for manipulating these symbols', 1, NULL),
('math', 'Analysis', 'The branch of mathematics dealing with limits and related theories, such as differentiation, integration, measure, infinite series, and analytic functions', 1, NULL),
('math', 'Geometry', 'The branch of mathematics concerned with the properties and relations of points, lines, surfaces, and solids', 1, NULL),
('math', 'Number Theory', 'The branch of mathematics that deals with the properties and relationships of numbers, especially integers', 1, NULL),
('math', 'Topology', 'The study of geometric properties and spatial relations unaffected by the continuous change of shape or size of figures', 1, NULL),
('math', 'Probability & Statistics', 'The study of random events and the collection, analysis, interpretation, and presentation of data', 1, NULL),
('math', 'Dynamical Systems', 'The study of systems that evolve over time according to a fixed rule', 1, NULL),
('math', 'Logic & Foundations', 'The study of formal systems, mathematical logic, and the foundations of mathematics', 1, NULL);

-- Insert Calculus and its subfields under Analysis
WITH analysis AS (SELECT id FROM field_hierarchy WHERE name = 'Analysis' AND field_category = 'math')
INSERT INTO field_hierarchy (field_category, name, description, level, parent_id) VALUES
('math', 'Calculus', 'The mathematical study of continuous change', 2, (SELECT id FROM analysis)),
('math', 'Real Analysis', 'The study of real numbers and real-valued functions', 2, (SELECT id FROM analysis)),
('math', 'Complex Analysis', 'The study of complex numbers and complex-valued functions', 2, (SELECT id FROM analysis)),
('math', 'Functional Analysis', 'The study of vector spaces endowed with some kind of limit-related structure', 2, (SELECT id FROM analysis)),
('math', 'Harmonic Analysis', 'The study of functions and their representations', 2, (SELECT id FROM analysis)),
('math', 'Measure Theory', 'The study of measures and their applications', 2, (SELECT id FROM analysis));

-- Insert Calculus subfields
WITH calculus AS (SELECT id FROM field_hierarchy WHERE name = 'Calculus' AND field_category = 'math')
INSERT INTO field_hierarchy (field_category, name, description, level, parent_id) VALUES
('math', 'Single Variable Calculus', 'The study of functions of one real variable', 3, (SELECT id FROM calculus)),
('math', 'Multivariable Calculus', 'The study of functions of several real variables', 3, (SELECT id FROM calculus)),
('math', 'Vector Calculus', 'The study of vector fields and differential operators', 3, (SELECT id FROM calculus)),
('math', 'Tensor Calculus', 'The study of tensors and their applications', 3, (SELECT id FROM calculus)),
('math', 'Differential Equations', 'The study of equations involving derivatives', 3, (SELECT id FROM calculus));

-- Insert Algebra subfields
WITH algebra AS (SELECT id FROM field_hierarchy WHERE name = 'Algebra' AND field_category = 'math')
INSERT INTO field_hierarchy (field_category, name, description, level, parent_id) VALUES
('math', 'Linear Algebra', 'The study of vector spaces and linear mappings between such spaces', 2, (SELECT id FROM algebra)),
('math', 'Abstract Algebra', 'The study of algebraic structures such as groups, rings, and fields', 2, (SELECT id FROM algebra)),
('math', 'Commutative Algebra', 'The study of commutative rings and their ideals', 2, (SELECT id FROM algebra)),
('math', 'Group Theory', 'The study of groups and their properties', 2, (SELECT id FROM algebra)),
('math', 'Ring Theory', 'The study of rings and their properties', 2, (SELECT id FROM algebra)),
('math', 'Field Theory', 'The study of fields and their properties', 2, (SELECT id FROM algebra)),
('math', 'Galois Theory', 'The study of field extensions and their automorphisms', 2, (SELECT id FROM algebra));

-- Insert Geometry subfields
WITH geometry AS (SELECT id FROM field_hierarchy WHERE name = 'Geometry' AND field_category = 'math')
INSERT INTO field_hierarchy (field_category, name, description, level, parent_id) VALUES
('math', 'Euclidean Geometry', 'The study of plane and solid figures based on Euclid''s axioms', 2, (SELECT id FROM geometry)),
('math', 'Differential Geometry', 'The study of geometry using calculus and linear algebra', 2, (SELECT id FROM geometry)),
('math', 'Algebraic Geometry', 'The study of geometric objects defined by polynomial equations', 2, (SELECT id FROM geometry)),
('math', 'Riemannian Geometry', 'The study of smooth manifolds with a Riemannian metric', 2, (SELECT id FROM geometry)),
('math', 'Projective Geometry', 'The study of geometric properties that are invariant under projective transformations', 2, (SELECT id FROM geometry)),
('math', 'Discrete Geometry', 'The study of geometric objects that have a discrete structure', 2, (SELECT id FROM geometry));

-- Insert Topology subfields
WITH topology AS (SELECT id FROM field_hierarchy WHERE name = 'Topology' AND field_category = 'math')
INSERT INTO field_hierarchy (field_category, name, description, level, parent_id) VALUES
('math', 'General Topology', 'The study of topological spaces and continuous functions', 2, (SELECT id FROM topology)),
('math', 'Algebraic Topology', 'The use of algebraic methods to study topological spaces', 2, (SELECT id FROM topology)),
('math', 'Differential Topology', 'The study of differentiable manifolds and differentiable maps', 2, (SELECT id FROM topology)),
('math', 'Geometric Topology', 'The study of manifolds and their embeddings', 2, (SELECT id FROM topology)),
('math', 'Knot Theory', 'The study of mathematical knots', 2, (SELECT id FROM topology));

-- Insert Algebraic Topology subfields
WITH alg_topology AS (SELECT id FROM field_hierarchy WHERE name = 'Algebraic Topology' AND field_category = 'math')
INSERT INTO field_hierarchy (field_category, name, description, level, parent_id) VALUES
('math', 'Homology Theory', 'The study of homology groups and their applications', 3, (SELECT id FROM alg_topology)),
('math', 'Cohomology Theory', 'The study of cohomology groups and their applications', 3, (SELECT id FROM alg_topology)),
('math', 'Homotopy Theory', 'The study of continuous deformations between maps', 3, (SELECT id FROM alg_topology)),
('math', 'Fiber Bundles', 'The study of spaces that locally look like product spaces', 3, (SELECT id FROM alg_topology));

-- Insert Differential Geometry subfields
WITH diff_geometry AS (SELECT id FROM field_hierarchy WHERE name = 'Differential Geometry' AND field_category = 'math')
INSERT INTO field_hierarchy (field_category, name, description, level, parent_id) VALUES
('math', 'Manifold Theory', 'The study of smooth manifolds and their properties', 3, (SELECT id FROM diff_geometry)),
('math', 'Lie Groups', 'The study of groups that are also smooth manifolds', 3, (SELECT id FROM diff_geometry)),
('math', 'Riemann Surfaces', 'The study of one-dimensional complex manifolds', 3, (SELECT id FROM diff_geometry)),
('math', 'Symplectic Geometry', 'The study of symplectic manifolds and their properties', 3, (SELECT id FROM diff_geometry));

-- Insert Number Theory subfields
WITH number_theory AS (SELECT id FROM field_hierarchy WHERE name = 'Number Theory' AND field_category = 'math')
INSERT INTO field_hierarchy (field_category, name, description, level, parent_id) VALUES
('math', 'Elementary Number Theory', 'The study of integers and basic properties of prime numbers', 2, (SELECT id FROM number_theory)),
('math', 'Analytic Number Theory', 'The use of methods from analysis to solve problems in number theory', 2, (SELECT id FROM number_theory)),
('math', 'Algebraic Number Theory', 'The study of algebraic structures related to integers', 2, (SELECT id FROM number_theory)),
('math', 'Modular Forms', 'The study of complex analytic functions with special transformation properties', 2, (SELECT id FROM number_theory)),
('math', 'Elliptic Curves', 'The study of curves defined by cubic equations', 2, (SELECT id FROM number_theory));

-- Insert Probability & Statistics subfields
WITH prob_stats AS (SELECT id FROM field_hierarchy WHERE name = 'Probability & Statistics' AND field_category = 'math')
INSERT INTO field_hierarchy (field_category, name, description, level, parent_id) VALUES
('math', 'Probability Theory', 'The study of random events and their likelihood', 2, (SELECT id FROM prob_stats)),
('math', 'Statistical Inference', 'The process of drawing conclusions from data', 2, (SELECT id FROM prob_stats)),
('math', 'Stochastic Processes', 'The study of random processes evolving over time', 2, (SELECT id FROM prob_stats)),
('math', 'Bayesian Statistics', 'The study of statistical inference using probability', 2, (SELECT id FROM prob_stats)),
('math', 'Time Series Analysis', 'The study of data points collected over time', 2, (SELECT id FROM prob_stats));

-- Add connections between fields with detailed explanations
INSERT INTO field_connections (source_field_id, target_field_id, connection_type, description)
SELECT 
    s.id as source_id,
    t.id as target_id,
    'prerequisite',
    CASE
        -- Calculus and Analysis connections
        WHEN s.name = 'Single Variable Calculus' AND t.name = 'Multivariable Calculus' 
            THEN 'Multivariable calculus extends single variable concepts to functions of multiple variables'
        WHEN s.name = 'Multivariable Calculus' AND t.name = 'Vector Calculus' 
            THEN 'Vector calculus builds upon multivariable calculus by introducing vector fields and operations'
        WHEN s.name = 'Vector Calculus' AND t.name = 'Tensor Calculus' 
            THEN 'Tensor calculus generalizes vector calculus to higher dimensions and more complex transformations'
        WHEN s.name = 'Real Analysis' AND t.name = 'Complex Analysis' 
            THEN 'Complex analysis extends real analysis concepts to complex numbers and functions'
        WHEN s.name = 'Calculus' AND t.name = 'Differential Equations' 
            THEN 'Differential equations require a strong foundation in calculus for solving and analyzing solutions'
        
        -- Algebra connections
        WHEN s.name = 'Linear Algebra' AND t.name = 'Abstract Algebra' 
            THEN 'Abstract algebra generalizes concepts from linear algebra to more general algebraic structures'
        WHEN s.name = 'Group Theory' AND t.name = 'Ring Theory' 
            THEN 'Ring theory extends group theory concepts to structures with two operations'
        WHEN s.name = 'Ring Theory' AND t.name = 'Field Theory' 
            THEN 'Field theory builds upon ring theory by adding multiplicative inverses'
        WHEN s.name = 'Field Theory' AND t.name = 'Galois Theory' 
            THEN 'Galois theory uses field theory to study polynomial equations and their solutions'
        
        -- Geometry and Topology connections
        WHEN s.name = 'Euclidean Geometry' AND t.name = 'Differential Geometry' 
            THEN 'Differential geometry extends Euclidean geometry to curved spaces using calculus'
        WHEN s.name = 'Differential Geometry' AND t.name = 'Riemannian Geometry' 
            THEN 'Riemannian geometry builds on differential geometry by adding metric structures'
        WHEN s.name = 'Differential Geometry' AND t.name = 'Manifold Theory' 
            THEN 'Manifold theory uses differential geometry to study spaces that locally look like Euclidean space'
        WHEN s.name = 'Topology' AND t.name = 'Algebraic Topology' 
            THEN 'Algebraic topology uses algebraic methods to study topological spaces'
        WHEN s.name = 'Algebraic Topology' AND t.name = 'Homology Theory' 
            THEN 'Homology theory is a fundamental tool in algebraic topology for studying topological spaces'
        WHEN s.name = 'Homology Theory' AND t.name = 'Cohomology Theory' 
            THEN 'Cohomology theory extends homology theory with additional algebraic structure'
        
        -- Number Theory connections
        WHEN s.name = 'Elementary Number Theory' AND t.name = 'Analytic Number Theory' 
            THEN 'Analytic number theory uses methods from analysis to solve problems in number theory'
        WHEN s.name = 'Elementary Number Theory' AND t.name = 'Algebraic Number Theory' 
            THEN 'Algebraic number theory extends elementary number theory using algebraic methods'
        WHEN s.name = 'Algebraic Number Theory' AND t.name = 'Elliptic Curves' 
            THEN 'Elliptic curves are studied using techniques from algebraic number theory'
        
        -- Probability and Statistics connections
        WHEN s.name = 'Probability Theory' AND t.name = 'Statistical Inference' 
            THEN 'Statistical inference uses probability theory to draw conclusions from data'
        WHEN s.name = 'Probability Theory' AND t.name = 'Stochastic Processes' 
            THEN 'Stochastic processes extend probability theory to study random processes over time'
        WHEN s.name = 'Statistical Inference' AND t.name = 'Bayesian Statistics' 
            THEN 'Bayesian statistics builds upon statistical inference using probability theory'
        
        -- Cross-branch connections
        WHEN s.name = 'Linear Algebra' AND t.name = 'Differential Geometry' 
            THEN 'Linear algebra provides essential tools for studying tangent spaces and vector fields in differential geometry'
        WHEN s.name = 'Analysis' AND t.name = 'Differential Geometry' 
            THEN 'Analysis provides the foundation for studying smooth functions and manifolds in differential geometry'
        WHEN s.name = 'Algebra' AND t.name = 'Algebraic Geometry' 
            THEN 'Algebraic geometry uses algebraic methods to study geometric objects defined by polynomial equations'
        WHEN s.name = 'Topology' AND t.name = 'Differential Topology' 
            THEN 'Differential topology combines topological and differential geometric methods to study smooth manifolds'
        WHEN s.name = 'Calculus' AND t.name = 'Dynamical Systems' 
            THEN 'Dynamical systems use calculus to study how systems evolve over time'
        WHEN s.name = 'Linear Algebra' AND t.name = 'Functional Analysis' 
            THEN 'Functional analysis extends linear algebra to infinite-dimensional vector spaces'
        WHEN s.name = 'Real Analysis' AND t.name = 'Measure Theory' 
            THEN 'Measure theory provides the foundation for modern integration theory in real analysis'
        WHEN s.name = 'Group Theory' AND t.name = 'Lie Groups' 
            THEN 'Lie groups combine group theory with differential geometry to study continuous symmetry'
        WHEN s.name = 'Complex Analysis' AND t.name = 'Riemann Surfaces' 
            THEN 'Riemann surfaces are studied using techniques from complex analysis'
        WHEN s.name = 'Probability Theory' AND t.name = 'Time Series Analysis' 
            THEN 'Time series analysis uses probability theory to study data collected over time'
        
        -- Logic and Foundations connections
        WHEN s.name = 'Logic & Foundations' AND t.name = 'Set Theory' 
            THEN 'Set theory provides the foundation for modern mathematics'
        WHEN s.name = 'Set Theory' AND t.name = 'Model Theory' 
            THEN 'Model theory studies the relationship between formal languages and their interpretations'
        WHEN s.name = 'Logic & Foundations' AND t.name = 'Proof Theory' 
            THEN 'Proof theory studies the structure of mathematical proofs'
        
        ELSE 'Understanding of ' || s.name || ' is helpful for studying ' || t.name
    END as description
FROM field_hierarchy s
CROSS JOIN field_hierarchy t
WHERE s.field_category = 'math' 
AND t.field_category = 'math'
AND s.id != t.id
AND (
    -- Calculus and Analysis connections
    (s.name = 'Single Variable Calculus' AND t.name = 'Multivariable Calculus')
    OR (s.name = 'Multivariable Calculus' AND t.name = 'Vector Calculus')
    OR (s.name = 'Vector Calculus' AND t.name = 'Tensor Calculus')
    OR (s.name = 'Real Analysis' AND t.name = 'Complex Analysis')
    OR (s.name = 'Calculus' AND t.name = 'Differential Equations')
    
    -- Algebra connections
    OR (s.name = 'Linear Algebra' AND t.name = 'Abstract Algebra')
    OR (s.name = 'Group Theory' AND t.name = 'Ring Theory')
    OR (s.name = 'Ring Theory' AND t.name = 'Field Theory')
    OR (s.name = 'Field Theory' AND t.name = 'Galois Theory')
    
    -- Geometry and Topology connections
    OR (s.name = 'Euclidean Geometry' AND t.name = 'Differential Geometry')
    OR (s.name = 'Differential Geometry' AND t.name = 'Riemannian Geometry')
    OR (s.name = 'Differential Geometry' AND t.name = 'Manifold Theory')
    OR (s.name = 'Topology' AND t.name = 'Algebraic Topology')
    OR (s.name = 'Algebraic Topology' AND t.name = 'Homology Theory')
    OR (s.name = 'Homology Theory' AND t.name = 'Cohomology Theory')
    
    -- Number Theory connections
    OR (s.name = 'Elementary Number Theory' AND t.name = 'Analytic Number Theory')
    OR (s.name = 'Elementary Number Theory' AND t.name = 'Algebraic Number Theory')
    OR (s.name = 'Algebraic Number Theory' AND t.name = 'Elliptic Curves')
    
    -- Probability and Statistics connections
    OR (s.name = 'Probability Theory' AND t.name = 'Statistical Inference')
    OR (s.name = 'Probability Theory' AND t.name = 'Stochastic Processes')
    OR (s.name = 'Statistical Inference' AND t.name = 'Bayesian Statistics')
    
    -- Cross-branch connections
    OR (s.name = 'Linear Algebra' AND t.name = 'Differential Geometry')
    OR (s.name = 'Analysis' AND t.name = 'Differential Geometry')
    OR (s.name = 'Algebra' AND t.name = 'Algebraic Geometry')
    OR (s.name = 'Topology' AND t.name = 'Differential Topology')
    OR (s.name = 'Calculus' AND t.name = 'Dynamical Systems')
    OR (s.name = 'Linear Algebra' AND t.name = 'Functional Analysis')
    OR (s.name = 'Real Analysis' AND t.name = 'Measure Theory')
    OR (s.name = 'Group Theory' AND t.name = 'Lie Groups')
    OR (s.name = 'Complex Analysis' AND t.name = 'Riemann Surfaces')
    OR (s.name = 'Probability Theory' AND t.name = 'Time Series Analysis')
    
    -- Logic and Foundations connections
    OR (s.name = 'Logic & Foundations' AND t.name = 'Set Theory')
    OR (s.name = 'Set Theory' AND t.name = 'Model Theory')
    OR (s.name = 'Logic & Foundations' AND t.name = 'Proof Theory')
); 
export const DEFAULT_PROGRAM_TEMPLATES = [
  {
    id: 'template-habits-21d',
    title: '21-Day Habit & Metabolic Reset',
    category: 'Habits & Wellness',
    durationDays: 21,
    description: 'A scientifically grounded habit architecture designed to stabilize morning circadian rhythm, improve metabolic baseline, and build evening wind-down rituals.',
    guidelines: 'Focus on consistency over perfection. If a day is missed, resume immediately without doubling up. Drink water first thing before reaching for caffeine or screens.',
    isTemplate: true,
    tasks: [
      {
        id: 'task-h1',
        title: 'Morning Circadian Hydration',
        description: 'Drink 500ml water with pinch of natural sea salt or lemon before consuming coffee or tea.',
        frequency: 'Daily',
        category: 'Hydration',
        targetMetric: '500 ml'
      },
      {
        id: 'task-h2',
        title: 'Morning Sunlight & Zone 2 Walk',
        description: '15 to 20 minutes outdoor natural light exposure and brisk walk within 60 minutes of waking.',
        frequency: 'Daily',
        category: 'Movement',
        targetMetric: '20 mins'
      },
      {
        id: 'task-h3',
        title: 'Nutrient-Dense Anchor Meal',
        description: 'Prioritize at least 30g protein and colorful dietary fiber for the first meal of the day.',
        frequency: 'Daily',
        category: 'Nutrition',
        targetMetric: '30g protein'
      },
      {
        id: 'task-h4',
        title: 'Evening Digital Sunset & Wind-down',
        description: 'Turn off active blue screens 45 minutes before sleep. Switch to warm low lighting or reading.',
        frequency: 'Daily',
        category: 'Sleep',
        targetMetric: '45 mins before bed'
      }
    ]
  },
  {
    id: 'template-fitness-6w',
    title: '6-Week Strength & Functional Mobility',
    category: 'Fitness & Conditioning',
    durationDays: 42,
    description: 'Progressive overload training paired with daily joint decompression, designed for sustainable athletic capacity and posture alignment.',
    guidelines: 'Prioritize form and controlled eccentrics over weight load. Log weights and rate of perceived exertion (RPE 7-8).',
    isTemplate: true,
    tasks: [
      {
        id: 'task-f1',
        title: 'Dynamic Joint Mobility Flow',
        description: 'Thoracic rotations, 90/90 hip flow, world\'s greatest stretch, and ankle dorsiflexion rocks.',
        frequency: 'Daily',
        category: 'Mobility',
        targetMetric: '10 mins'
      },
      {
        id: 'task-f2',
        title: 'Structured Resistance Training',
        description: 'Execute assigned split (Push, Pull, or Legs) with 3 core compound lifts and 2 accessory movements.',
        frequency: 'Mon, Wed, Fri, Sat',
        category: 'Strength',
        targetMetric: '45-60 mins'
      },
      {
        id: 'task-f3',
        title: 'Daily Non-Exercise Steps (NEAT)',
        description: 'Accumulate target daily movement steps across the day to support glycemic recovery.',
        frequency: 'Daily',
        category: 'Movement',
        targetMetric: '8,000 - 10,000 steps'
      },
      {
        id: 'task-f4',
        title: 'Post-Workout Cool-Down & Breathwork',
        description: '4-7-8 parasympathetic down-regulation breathing + gentle hamstring & quad stretching.',
        frequency: 'Workout days',
        category: 'Recovery',
        targetMetric: '8 mins'
      }
    ]
  },
  {
    id: 'template-nutrition-28d',
    title: 'Mediterranean Anti-Inflammatory Protocol',
    category: 'Nutrition & Dietetics',
    durationDays: 28,
    description: 'Whole-food dietary program centered on polyphenol-rich vegetables, extra virgin olive oil, wild-caught omega-3s, and gut-microbiome diversity.',
    guidelines: 'Aim for 30 unique plant foods per week. Avoid ultra-processed seed oils and refined sugars. Sit down and chew slowly.',
    isTemplate: true,
    tasks: [
      {
        id: 'task-n1',
        title: 'Microbiome Diversity Target (3+ Veggies/Meal)',
        description: 'Incorporate at least 3 distinct vegetable or leafy green varieties into lunch and dinner.',
        frequency: 'Daily',
        category: 'Nutrition',
        targetMetric: '3 varieties'
      },
      {
        id: 'task-n2',
        title: 'Omega-3 & Healthy Fat Anchor',
        description: 'Include 1 serving of wild fatty fish, flax/chia seeds, or 2 tbsp extra virgin olive oil.',
        frequency: 'Daily',
        category: 'Nutrition',
        targetMetric: '1 serving'
      },
      {
        id: 'task-n3',
        title: 'Optimal Hydration Intake',
        description: 'Reach total daily fluid consumption of 2.5 Liters of water or unsweetened herbal infusion.',
        frequency: 'Daily',
        category: 'Hydration',
        targetMetric: '2.5 Liters'
      },
      {
        id: 'task-n4',
        title: 'Mindful Eating & Satiety Reflection',
        description: 'Eat main meals seated without watching video screens; stop at 80% fullness (Hara Hachi Bu).',
        frequency: 'Daily',
        category: 'Habits',
        targetMetric: '2 meals'
      }
    ]
  },
  {
    id: 'template-rehab-30d',
    title: 'Lumbar Spine & Core Rehabilitation',
    category: 'Physiotherapy & Rehab',
    durationDays: 30,
    description: 'Evidence-based McKenzie and McGill Big 3 rehabilitation sequence to alleviate non-specific lower back stiffness and restore pelvic stability.',
    guidelines: 'Move strictly within pain-free active range of motion. Zero sharp pain. If discomfort occurs, stop and log in your check-in notes.',
    isTemplate: true,
    tasks: [
      {
        id: 'task-r1',
        title: 'McGill Big 3 Spinal Stabilization',
        description: 'Modified Curl-Up, Side Plank (from knees if needed), and Bird-Dog with 8-second isometric holds.',
        frequency: 'Daily',
        category: 'Rehab',
        targetMetric: '3 sets each'
      },
      {
        id: 'task-r2',
        title: 'Glute Activation & Pelvic Alignment',
        description: 'Banded glute bridges (slow 3-sec eccentric lower) and quadruped hip extensions.',
        frequency: 'Daily',
        category: 'Rehab',
        targetMetric: '2 sets x 12 reps'
      },
      {
        id: 'task-r3',
        title: 'Midday Desk Posture & Micro-Breaks',
        description: 'Stand up every 45 minutes; perform standing lumbar extensions and shoulder external rotations.',
        frequency: 'Daily',
        category: 'Ergonomics',
        targetMetric: '3 micro-breaks'
      },
      {
        id: 'task-r4',
        title: 'Evening Lumbar Decompression & Log',
        description: 'Psoas resting position (legs on 90-degree chair) for 10 minutes; rate daily discomfort scale 0-10.',
        frequency: 'Daily',
        category: 'Recovery',
        targetMetric: '10 mins + VAS score'
      }
    ]
  },
  {
    id: 'template-diabetes-india-30d',
    title: '30-Day Indian Diabetes & Glycemic Reset',
    category: 'Clinical Nutrition & Diabetes',
    durationDays: 30,
    description: 'Evidence-based glycemic control architecture for Type 2 Diabetes and pre-diabetes. Focuses on post-prandial glucose blunting, traditional herbal anchors, and daily step volume.',
    guidelines: 'Walk for 15-20 minutes strictly after lunch or dinner. Do not skip the morning fenugreek water. Log blood sugar levels in reflection notes when testing.',
    isTemplate: true,
    tasks: [
      {
        id: 'task-dia-1',
        title: 'Morning Soaked Methi (Fenugreek) Water',
        description: 'Drink 250ml water soaked overnight with 1 tsp fenugreek seeds; chew seeds for glycemic fiber.',
        frequency: 'Daily (Empty Stomach)',
        category: 'Glycemic Anchor',
        targetMetric: '250 ml + 1 tsp seeds'
      },
      {
        id: 'task-dia-2',
        title: 'Low-GI Complex Carbohydrate Plate',
        description: 'Replace refined wheat/white rice with ragi, jowar, or steel-cut oats paired with 1 cup green sabzi and dal.',
        frequency: 'Daily (Lunch & Dinner)',
        category: 'Nutrition',
        targetMetric: '2 main meals'
      },
      {
        id: 'task-dia-3',
        title: 'Post-Meal Glycemic Walk',
        description: '15-20 minutes brisk walking within 30 minutes following lunch or dinner to enhance GLUT-4 muscle uptake.',
        frequency: 'Daily',
        category: 'Movement',
        targetMetric: '20 mins'
      },
      {
        id: 'task-dia-4',
        title: 'Bedtime Cinnamon & Warm Water',
        description: '1 cup warm water with pinch of Ceylon cinnamon to support overnight hepatic glucose regulation.',
        frequency: 'Daily (Night)',
        category: 'Recovery',
        targetMetric: '1 cup'
      }
    ]
  },
  {
    id: 'template-pcos-india-28d',
    title: '28-Day PCOS & Hormonal Balance Protocol',
    category: 'Women\'s Health & PCOS',
    durationDays: 28,
    description: 'Targeted endocrine and insulin-sensitizing dietary protocol for PCOS management, cycle regularity, and androgens reduction.',
    guidelines: 'Incorporate daily seed cycling (Flax + Pumpkin days 1-14, Sesame + Sunflower days 15-28). Maintain a consistent 10:30 PM sleep schedule.',
    isTemplate: true,
    tasks: [
      {
        id: 'task-pcos-1',
        title: 'Hormonal Seed Cycling Anchor',
        description: '1 tbsp freshly ground raw seeds matching your current menstrual cycle phase.',
        frequency: 'Daily (Morning)',
        category: 'Hormonal Support',
        targetMetric: '1 tbsp ground seeds'
      },
      {
        id: 'task-pcos-2',
        title: 'Spearmint & Green Tea Infusion',
        description: '1-2 cups organic spearmint tea to naturally reduce free circulating androgens and acne flare-ups.',
        frequency: 'Daily (Mid-morning)',
        category: 'Endocrine Support',
        targetMetric: '2 cups'
      },
      {
        id: 'task-pcos-3',
        title: 'Low-Impact Strength or Brisk Walk',
        description: '30 minutes zone 2 walking or low-cortisol resistance training. Avoid excessive high-intensity burnout.',
        frequency: 'Daily',
        category: 'Movement',
        targetMetric: '30 mins'
      },
      {
        id: 'task-pcos-4',
        title: 'Circadian Melatonin Guard (Screens Off)',
        description: 'Strict blue-light curfew 45 minutes before sleep to optimize progesterone and cortisol balance.',
        frequency: 'Daily (Night)',
        category: 'Sleep',
        targetMetric: '45 mins screen-free'
      }
    ]
  }
];

export const CATEGORIES = [
  'Clinical Nutrition & Diabetes',
  'Women\'s Health & PCOS',
  'Nutrition & Dietetics',
  'Habits & Wellness',
  'Fitness & Conditioning',
  'Physiotherapy & Rehab',
  'Recovery & Sleep',
  'General Wellness'
];

// Synthetic, browser-local design prototype. Never used as a clinical record.
export const WORKOUT_KEY='careloop_design_workouts_v1';
export function readWorkouts(){try{return JSON.parse(localStorage.getItem(WORKOUT_KEY))||{plans:{},logs:[]}}catch{return {plans:{},logs:[]}}}
export function saveWorkouts(value){localStorage.setItem(WORKOUT_KEY,JSON.stringify(value));window.dispatchEvent(new Event('careloop-workouts'));}

import StrengthTraining from "../app/components/StrengthTraining";
import CardioTracking from "../app/components/CardioTracking";
import CalorieTracking from "../app/components/CalorieTracking";

export default function Home() {
  return (
    <main style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>Workout Tracker</h1>
      <StrengthTraining />
      <CardioTracking />
      <CalorieTracking />
    </main>
  );
}

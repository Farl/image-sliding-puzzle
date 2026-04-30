function TimerDisplay({ elapsedSeconds }) {
  const minutes = Math.floor(elapsedSeconds / 60)
    .toString()
    .padStart(2, '0');
  const seconds = (elapsedSeconds % 60).toString().padStart(2, '0');

  return <h1 className="timer">{minutes}:{seconds}</h1>;
}

export default TimerDisplay;

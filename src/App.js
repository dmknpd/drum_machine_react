import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const App = () => {
  const data = useMemo(
    () => ({
      Q: "https://s3.amazonaws.com/freecodecamp/drums/Heater-1.mp3",
      W: "https://s3.amazonaws.com/freecodecamp/drums/Heater-2.mp3",
      E: "https://s3.amazonaws.com/freecodecamp/drums/Heater-3.mp3",
      A: "https://s3.amazonaws.com/freecodecamp/drums/Heater-4_1.mp3",
      S: "https://s3.amazonaws.com/freecodecamp/drums/Heater-6.mp3",
      D: "https://s3.amazonaws.com/freecodecamp/drums/Dsc_Oh.mp3",
      Z: "https://s3.amazonaws.com/freecodecamp/drums/Kick_n_Hat.mp3",
      X: "https://s3.amazonaws.com/freecodecamp/drums/RP4_KICK_1.mp3",
      C: "https://s3.amazonaws.com/freecodecamp/drums/Cev_H2.mp3",
    }),
    []
  );

  const [track, setTrack] = useState("");
  const [volume, setVolume] = useState(0.3);

  const buttonPanel = useRef([]);
  const soundPanel = useRef([]);

  const buttonPress = (index) => {
    buttonPanel.current[index].style.backgroundColor = "rgba(253,68,29,0.5)";
    setTimeout(
      () => (buttonPanel.current[index].style.backgroundColor = null),
      200
    );
  };

  const handleVolumeChange = (e) => {
    setVolume(e.target.value);
  };

  const displayText = useCallback(
    (id) => {
      const key = Object.keys(data)[id];

      setTrack(data[key].slice(44).replace(/_|-|\.mp3/g, " "));
    },
    [data]
  );

  const playSound = useCallback(
    (id) => {
      const sound = soundPanel.current[id];

      displayText(id);

      sound.currentTime = 0;
      sound.volume = volume;
      sound.play();
    },
    [volume, displayText]
  );

  useEffect(() => {
    const handleKeyPress = (e) => {
      const key = e.key.toUpperCase();
      const index = Object.keys(data).indexOf(key);
      if (index === -1) {
        return;
      }

      buttonPress(index);
      playSound(index);
    };

    document.addEventListener("keypress", handleKeyPress);

    return () => {
      document.removeEventListener("keypress", handleKeyPress);
    };
  }, [data, playSound]);

  const buttonCreator = () => {
    return Object.entries(data).map(([key, value], id) => (
      <button
        id={key}
        ref={(element) => (buttonPanel.current[id] = element)}
        className="button"
        onClick={() => playSound(id)}
      >
        <audio
          src={value}
          ref={(element) => (soundPanel.current[id] = element)}
        ></audio>
        {key}
      </button>
    ));
  };

  return (
    <div id="drum-machine">
      <div id="pad">{buttonCreator()}</div>
      <div id="control">
        <div id="display">{track}</div>
        <input
          id="volume"
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={volume}
          onChange={handleVolumeChange}
        />
        <div id="name">Drum Machine</div>
      </div>
    </div>
  );
};

export default App;

import { playerData, player, characterData, levelData } from "./state.js";

document.querySelector("[character-select]").addEventListener("change", (e) => {
  player.setAttribute("character", e.target.value);
  playerData.selectedCharacter = characterData[e.target.value];
  document
    .querySelector("[data-character-playing]")
    .setAttribute("data-character-playing", e.target.value);
  document
    .querySelector("[data-character-health]")
    .setAttribute("data-character-health", playerData.selectedCharacter.health);
  document
    .querySelector("[data-character-kills]")
    .setAttribute("data-character-kills", 0);
  document
    .querySelector("[data-character-level]")
    .setAttribute("data-character-level", 1);
});

document.querySelector("[level-start]").addEventListener("click", (e) => {
    document.querySelector("[character-selection-screen]").toggleAttribute("open")
    levelData.initializeLevel();
})
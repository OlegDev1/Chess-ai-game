import errorSoundPath from "../../../public/Error.ogg";

export default async function playErrorSound() {
  const errorAudio = new Audio(errorSoundPath);

  errorAudio.play().catch((e) => {
    console.error("Can not play error sound: ", e);
  });
}

export function formatStageLabel(
  stage: string
) {

  return (
    stage.charAt(0)
      .toUpperCase() +
    stage.slice(1)
  );

}
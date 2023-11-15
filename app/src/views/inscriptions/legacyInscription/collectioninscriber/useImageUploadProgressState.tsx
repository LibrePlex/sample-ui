import { Dispatch, SetStateAction, useState } from "react";
import { IImageUploaderState } from "./CustomImageUploader";

export enum Stage {
  NotStarted,
  UpdateTemplate,
  Resize,
  Write,
}

export enum StageProgress {
  NotStarted,
  Progress,
  Success,
  Fail,
}

export interface IImageUploadProgressState {
    updateStatus: {
      stage: Stage;
      result: StageProgress;
    },
    setUpdateStatus: Dispatch<SetStateAction<{
      stage: Stage;
      result: StageProgress;
    }>>
}

export const useImageUploadProgressState = (): IImageUploadProgressState => {
  const [updateStatus, setUpdateStatus] = useState<{
    stage: Stage;
    result: StageProgress;
  }>({ stage: Stage.NotStarted, result: StageProgress.NotStarted });

  return { updateStatus, setUpdateStatus };
};

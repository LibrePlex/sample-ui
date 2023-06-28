
import {CopyIcon} from "@chakra-ui/icons";
import { Button, ButtonProps } from "@chakra-ui/react";
import React from "react";
import { abbreviateKey } from "../../utils/abbreviateKey";
import { notify } from "../../utils/notifications";


// return a promise
export function copyToClipboard(
    notify: (newNotification: { type?: string; message: string; description?: string; txid?: string; }) => any,
    textToCopy: string
  ) {
    // navigator clipboard api needs a secure context (https)
  
    notify({type: "success", message: `Copied to clipboard: ${textToCopy}`});
  
    if (navigator.clipboard && window.isSecureContext) {
      // navigator clipboard api method'
      return navigator.clipboard.writeText(textToCopy);
    } else {
      // text area method
      let textArea = document.createElement("textarea");
      textArea.value = textToCopy;
      // make the textarea out of viewport
      textArea.style.position = "fixed";
      textArea.style.left = "-999999px";
      textArea.style.top = "-999999px";
      if (document) {
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        return new Promise((res, rej) => {
          // here the magic happens
          if (document) {
            document.execCommand("copy") ? res(0) : rej();
            textArea.remove();
          }
        });
      } else {
        return new Promise((res, rej) => {
          res(0);
        });
      }
    }
  }



export const CopyPublicKeyButton = ({
  publicKey,
  title,
  helperText,
  characters,
  size,
  ...rest
}: {
  color?: string;
  title?: string;
  helperText?: string;
  characters?: number;
  publicKey: string | undefined;
} & ButtonProps) => (
    <Button
        {...rest}
        size='small'
        variant='contained'
        onClick={(event) => {
            publicKey && copyToClipboard(notify, publicKey);
            event.stopPropagation();
        } }
    >
        {publicKey ? abbreviateKey(publicKey || "", characters || 4) : ""}
        {size !== 'small' && <CopyIcon
            sx={{
                ...rest.sx,
                padding: "3px",
                marginLeft: "8px",
            }} />}
    </Button>
);

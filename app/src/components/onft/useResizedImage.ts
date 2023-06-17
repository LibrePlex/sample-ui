import { useCallback, useEffect, useState } from "react";

export const useResizedImage = (sourceBase64: string) => {

    const [resizedImage, setResizedImage] = useState<string>()

    useEffect(()=> {
        let active = true;
        var img = document.createElement('img');
        img.setAttribute("src", sourceBase64);
    
        img.onload = () => {
            var iw = img.width;
            var ih = img.height;
            var canvas = document.createElement('canvas');
            var ctx = canvas.getContext("2d");
            
            var _scale = 1;
            canvas.width = img.width * _scale;
            canvas.height = img.height * _scale;
    
           
            
            var iwScaled = iw * _scale;
            var ihScaled = ih * _scale;
            canvas.width = iwScaled;
            canvas.height = ihScaled;
            ctx.imageSmoothingEnabled = false;
            ctx.drawImage(img, 0, 0, iwScaled, ihScaled);
            const newBase64 = canvas.toDataURL("image/bmp", _scale);
            console.log({newBase64})
            active && setResizedImage(newBase64);
        }
        return () => {
            active = false;
        }
    },[sourceBase64])

    return resizedImage
    
}
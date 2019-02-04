import jimp from 'jimp';
import path from 'path';
import PImage from 'pureimage';
import streamBuffers from 'stream-buffers';
import Promise from 'bluebird';
const font = PImage.registerFont(path.join(__dirname, '..', '..', 'assets', 'fonts', 'SourceSansPro-Regular.ttf'), 'Source Sans Pro');

const measureText = (font, ctx, text) => {
    if(!font) console.log("WARNING. Can't find font family ", ctx._font.family);
    var fsize   = ctx._font.size;
    var glyphs  = font.font.stringToGlyphs(text);
    var advance = 0;
    glyphs.forEach(function(g) { advance += g.advanceWidth; });

    return {
        width: advance/font.font.unitsPerEm*fsize,
        emHeightAscent: font.font.ascender/font.font.unitsPerEm*fsize,
        emHeightDescent: font.font.descender/font.font.unitsPerEm*fsize,
    };
};

const generatePImage = async (font, textString) => {
    const img = PImage.make(72, 72);
    const ctx = img.getContext('2d');
    ctx.clearRect(0, 0, 72, 72);
    ctx.font = '15pt "Source Sans Pro"';
    ctx.USE_FONT_GLYPH_CACHING = false;
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 2;
    ctx.fillStyle = '#ffffff';
    const textWidth = measureText(font, ctx, textString);
    ctx.strokeText(textString, 72/2-textWidth.width/2, 72-6);
    ctx.fillText(textString, 72/2-textWidth.width/2, 72-6);

    const writableStreamBuffer = new streamBuffers.WritableStreamBuffer({
        initialSize: 20736, // Start at what should be the exact size we need
        incrementAmount: 1024 // Grow by 1 kilobyte each time buffer overflows.
    });

    await PImage.encodePNGToStream(img, writableStreamBuffer);

    return writableStreamBuffer.getContents();
};

const generateBaseImage = backgroundColor => {
    return new Promise((resolve, reject) => {
        return new jimp(72, 72, backgroundColor, (err, img) => {
            if (err)
                reject(err);

            resolve(img);
        });
    });
};

const loadImageAndResize = imageName => {
    return jimp.read(imageName)
        .then(image => image.resize(54, 54));
};

const convertBufferToJimp = buffer => {
    return jimp.read(buffer);
};

function removeAlphaChannel(data) {
    const output = data.filter((_, i) => {
        return (i + 1) % 4;
    });

    return Buffer.from(output);
}

export function generateImage(props) {
    return new Promise((resolve, reject) => {
        font.load(async () => {
            try {
                let baseImage = await generateBaseImage(props.color);
                const bkg = await loadImageAndResize(path.join(__dirname, '..', '..', 'assets', props.backgroundImage));
                baseImage = baseImage.blit(bkg, 72/2 - 54/2, 0);
                const txt = await convertBufferToJimp(await generatePImage(font, props.text));
                baseImage = baseImage.blit(txt, 0, 0);
                resolve(removeAlphaChannel(baseImage.bitmap.data));
            } catch (err) {
                console.error(err);
                reject(err);
            }
        });
    });
};

export default {
    generateImage,
};

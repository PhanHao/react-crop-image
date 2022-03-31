import React, { useState } from 'react';
import { Modal } from 'antd';
import ReactCrop from 'react-image-crop';
import { isEmpty } from 'lodash';

type ReactImageCropProps = {
    aspectRatio: number,
    imgUpload: any,
    maxWidthCrop: number,
    croppedImageSize: any,
    isVisible?: boolean,
    onOk?: () => void,
    onCancel?: () => void,
    onCompleteCropImage?: ({ crop, sourceImage, file }: any) => void,
}

const ReactImageCrop = React.forwardRef((props: ReactImageCropProps, ref: any) => {
    const [crop, setCrop] = useState<any>();
    const { 
        imgUpload,
        isVisible = false,
        onOk,
        onCancel,
        onCompleteCropImage,
        aspectRatio,
        croppedImageSize,
        maxWidthCrop
    } = props;
    
    const maxWidth = maxWidthCrop / (ref?.current?.naturalWidth / ref?.current?.width);
    const maxHeight = maxWidth / aspectRatio;

    return (
        <Modal width={800} centered style={{ overflow: 'auto' }} bodyStyle={{ maxHeight: 600, overflow: 'auto' }} title="Modal Crop Image" visible={isVisible} onOk={onOk} onCancel={onCancel}>
            <ReactCrop
                aspect={aspectRatio}
                maxWidth={maxWidth}
                maxHeight={maxHeight}
                ruleOfThirds
                crop={crop}
                onComplete={(crop) => onCompleteCropImage?.({ crop, sourceImage: ref?.current, file: imgUpload })}
                onChange={c => setCrop(c)}
            >
                <img ref={ref} src={imgUpload.url} alt="ReactImageCrop"/>
            </ReactCrop>
            {!isEmpty(croppedImageSize) &&
                <div>
                    Width: {croppedImageSize.width} - Height: {croppedImageSize.height}
                </div>
            }
        </Modal>
    );
});

export default ReactImageCrop;

import React, { useRef, useState } from 'react';
import { Upload } from 'antd';
import ReactImageCrop from './ReactImageCrop';

const UploadFile = ({ aspectRatio, isCropImage = false, maxWidthCrop }: any ) => {
    const [fileList, setFileList] = useState<any[]>([]);
    const [visibleModalCrop, setVisibleModalCrop] = useState(false);
    const [imgUpload, setImgUpload] = useState<any>({});
    const [newFileUrl, setNewFileUrl] = useState('');
    const [croppedImageSize, setCroppedImageSize] = useState<any>({});
    const imgRef = useRef<HTMLImageElement>(null);

    const handleChange = async ({ file }: any) => {
        try {
            const { url, uid, type, name, originFileObj } = file;
            let fileUrl = url;
            if (!fileUrl) {
                fileUrl = await new Promise(resolve => {
                    const reader = new FileReader();
                    reader.readAsDataURL(originFileObj);
                    reader.onload = () => resolve(reader.result);
                });
            };

            if (fileUrl) {
                setImgUpload({ url: fileUrl, uid, type, name });
                setVisibleModalCrop(true);
            }
        } catch (error) {
            console.log(`Upload file error: ${error}`);
        }
    };

    const handleCropImage = () => {
        setVisibleModalCrop(false);
        setFileList([
            ...fileList,
            {
                ...imgUpload,
                url: newFileUrl,
            }
        ]);
    }

    const handleCancelCropImage = () => {
        setVisibleModalCrop(false);
    }

    const handleCompleteCropImage = async ({ crop, sourceImage, file }: any) => {
        const croppedImageUrl: any = await getCroppedImage({
            sourceImage,
            cropConfig: crop,
            fileName: file.name,
            type: file.type
        });

        const croppedImage = new Image();
        croppedImage.src = croppedImageUrl;
        croppedImage.onload = () => callBackImageCrop(croppedImage.width, croppedImage.height);

        if (croppedImageUrl){
            setNewFileUrl(croppedImageUrl);
        }
    }

    const getCroppedImage = ({ sourceImage, cropConfig, fileName, type }: any) => {
        const canvas: any = document.createElement('canvas');
        const scaleX = sourceImage.naturalWidth / sourceImage.width;

        const newWidth = cropConfig.width * scaleX;
        const newHeight = newWidth / aspectRatio;

        canvas.width = newWidth;
        canvas.height = newHeight;

        const ctx: any = canvas.getContext('2d');

        ctx.drawImage(sourceImage, cropConfig.x * scaleX, cropConfig.y * scaleX, newWidth, newHeight, 0, 0, newWidth, newHeight);

        if (ctx.getImageData(1, 1, 1, 1)?.data?.some((channel: any) => channel !== 0)) {
            return new Promise((resolve, reject) => {
                canvas.toBlob(
                    (blob: any) => {
                        if (!blob) {
                            reject(new Error('Canvas is empty'));
                            return;
                        }

                        console.log('--blob--', blob);
    
                        blob.name = fileName;
                        const croppedImageUrl = window.URL.createObjectURL(blob);
                        resolve(croppedImageUrl);
                    }, type, 1
                );
            });
        }
    }

    const callBackImageCrop = (width: any, height: any) => {
        setCroppedImageSize({ width, height });
    }

    return (
        <>
            <Upload
                listType="picture-card"
                fileList={fileList}
                onChange={handleChange}
            >
                Upload
            </Upload>
            {!visibleModalCrop && newFileUrl && <img src={newFileUrl} alt="aaa" />}
            {isCropImage && 
                <ReactImageCrop
                    aspectRatio={aspectRatio}
                    imgUpload={imgUpload}
                    isVisible={visibleModalCrop}
                    maxWidthCrop={maxWidthCrop}
                    croppedImageSize={croppedImageSize}
                    onOk={handleCropImage}
                    onCancel={handleCancelCropImage}
                    onCompleteCropImage={handleCompleteCropImage}
                    ref={imgRef}
                />
            }
        </>
    );
};

export default UploadFile;

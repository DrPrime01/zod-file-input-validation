/* eslint-disable @typescript-eslint/no-explicit-any */
import { DOCUMENT_SCHEMA, IMAGE_SCHEMA } from "./utils/schema";
import { useState, useEffect } from "react";

interface ErrorType {
  img_upload?: string;
  doc_upload?: string;
}

function App() {
  const [docFile, setDocFile] = useState<File | undefined>();
  const [imgFile, setImgFile] = useState<File | undefined>();
  const [imgUrl, setImgUrl] = useState("");
  const [error, setError] = useState<ErrorType>({});

  useEffect(() => {
    if (imgFile) {
      const url = URL.createObjectURL(imgFile);
      setImgUrl(url);

      return () => URL.revokeObjectURL(url);
    }
  }, [imgFile]);

  const validateFile = (file: File, schema: any, field: keyof ErrorType) => {
    const result = schema.safeParse(file);
    if (!result.success) {
      setError((prevError) => ({
        ...prevError,
        [field]: result.error.errors[0].message,
      }));
      return false;
    } else {
      setError((prevError) => ({
        ...prevError,
        [field]: undefined,
      }));
      return true;
    }
  };

  const handleDocChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const isValid = validateFile(file, DOCUMENT_SCHEMA, "doc_upload");
      if (isValid) setDocFile(file);
    }
  };

  const handleImgChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const isValid = validateFile(file, IMAGE_SCHEMA, "img_upload");
      if (isValid) setImgFile(file);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!docFile || !imgFile) {
      setError({
        doc_upload: !docFile ? "Document file is required" : undefined,
        img_upload: !imgFile ? "Image file is required" : undefined,
      });
      return;
    }

    console.log("Form submitted with:", { docFile, imgFile });
    setDocFile(undefined);
    setImgFile(undefined);
    setImgUrl("");
    setError({});
  };

  return (
    <div className="app-container">
      <h1>File Input Validation with Zod</h1>
      <div className="form-container">
        <form className="form" onSubmit={handleSubmit}>
          <div className="formfield">
            <label htmlFor="doc-input">
              <p>Document Input</p>
              <div className="doc-label">
                {docFile?.name ? (
                  <p>{docFile?.name}</p>
                ) : (
                  <p>
                    <span>Browse</span> to upload document here{" "}
                  </p>
                )}
                <p className="size">(5MB Max)</p>
              </div>
            </label>
            <input
              id="doc-input"
              name="doc_upload"
              type="file"
              onChange={handleDocChange}
              accept="application/*"
            />
            {error.doc_upload && <p className="error">{error.doc_upload}</p>}
          </div>
          <div className="formfield">
            <label htmlFor="img-input">
              <p>Image Input</p>
              <div className="image-label">
                {imgUrl ? (
                  <img src={imgUrl} alt="img-input" />
                ) : (
                  <div>
                    <p>
                      <span>Browse</span> to upload image here{" "}
                    </p>
                    <p className="size">(5MB Max)</p>
                  </div>
                )}
              </div>
            </label>
            <input
              id="img-input"
              name="img_upload"
              type="file"
              accept="image/*"
              onChange={handleImgChange}
            />
            {error.img_upload && <p className="error">{error.img_upload}</p>}
          </div>
          <button
            type="submit"
            disabled={
              !!error.doc_upload || !!error.img_upload || !docFile || !imgFile
            }
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}

export default App;

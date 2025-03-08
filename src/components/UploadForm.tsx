import { useState } from "react";
import { Button } from "@/components/ui/button"; // Assuming you have a Button component
import axios from "axios";

const UploadForm = () => {
  const [file, setFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleFileUpload = async () => {
    if (!file) {
      return alert("Please select a file first.");
    }

    setIsLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      // Make an API request to upload the file to Cloudinary
      const response = await axios.post("/api/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.url) {
        setImageUrl(response.data.url);
        alert("File uploaded successfully!");
      }
    } catch (error) {
      console.error(error);
      alert("Error uploading the file.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <label htmlFor="fileInput">select<input type="file" accept="image/*" onChange={handleFileChange} /></label>
      <Button onClick={handleFileUpload} disabled={isLoading}>
        {isLoading ? "Uploading..." : "Upload Image"}
      </Button>

      {imageUrl && (
        <div className="mt-4">
          <img src={imageUrl} alt="Uploaded" className="max-w-full h-auto" />
        </div>
      )}
    </div>
  );
};

export default UploadForm;

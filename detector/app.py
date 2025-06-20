from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import torch
from torchvision import transforms
from PIL import Image
import timm
import io

# 🚀 FastAPI setup
app = FastAPI()
app.add_middleware(
    CORSMiddleware, allow_origins=["*"], allow_credentials=True,
    allow_methods=["*"], allow_headers=["*"]
)

# 📌 Labels from your dataset
labels = [
     "bench press",  "dumbbell", "kettlebell",
    "pullup bar",  "treadmill"
]

# 🔁 Transforms (match training pipeline)
transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406],
                         std=[0.229, 0.224, 0.225]),
])

# 🔧 Load model at startup (ReXNet)
model = timm.create_model("rexnet_150", pretrained=False, num_classes=len(labels))
model.load_state_dict(torch.load("model.pth", map_location="cpu"))
model.eval()
print("✅ Model loaded and ready.")

# 🔍 Inference route
@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    try:
        image_bytes = await file.read()
        image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        input_tensor = transform(image).unsqueeze(0)  # Add batch dimension

        with torch.no_grad():
            output = model(input_tensor)
            predicted_idx = output.argmax(dim=1).item()
            predicted_label = labels[predicted_idx]

        return {"label": predicted_label}

    except Exception as e:
        return {"error": str(e)}

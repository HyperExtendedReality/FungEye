# FungEye
#### Video Demo:  https://youtu.be/OadESCnb9vg

#### Description:
**FungEye** is a professional-grade mobile application designed to integrate advanced computer vision into the practice of safe foraging. Developed as a solo project, FungEye bridges the divide between theoretical deep learning and practical, real-world utility. By optimizing complex classification models for mobile deployment, the app provides foragers with a reliable digital companion for identifying mushroom species and distinguishing them from toxic look-alikes with scientific accuracy.

### Key Features
*   **Real-Time Fungal Identification:** Leverages high-speed computer vision to identify mushroom species instantly via the device camera.
*   **Offline-First Architecture:** Since foraging often occurs in remote areas with limited connectivity, the app utilizes a local database to ensure all identification and species data remain accessible.
*   **Safety-Centric Design:** Focused specifically on fine-grained classification to help users recognize dangerous "look-alike" species.

### Technical Deep Dive: The AI Model
The intelligence of FungEye is powered by a **YOLO11l (Large)** classification model. To achieve the high level of precision required for safe identification while maintaining mobile performance, I implemented a **Knowledge Distillation** workflow:

1.  **The Teacher:** A **YOLO11x (Extra-Large)** model was trained on a comprehensive **1.23GB curated mushroom dataset**. This model captured high-level feature representations and complex patterns within the fungal kingdom.
2.  **The Student:** I distilled the "knowledge" (soft targets) from the Teacher model into a **YOLO11l** architecture. 
3.  **The Result:** This process produced a model that retains the sophisticated accuracy of the Extra-Large version but is optimized for the inference speeds required for a fluid mobile user experience.

### The Tech Stack
*   **Frontend:** **Expo & React Native** for a high-performance, cross-platform mobile UI.
*   **Logic:** **TypeScript** to ensure a robust, type-safe codebase for handling complex model metadata and app state.
*   **Local Storage:** **SQLite** to manage the local persistence of mushroom species data, toxicity warnings, and user history without requiring an internet connection.

### Project Impact
FungEye transforms a standard smartphone into a sophisticated mycological tool. By combining modern computer vision with mobile-first engineering, the project demonstrates how deep learning can be distilled and deployed to solve high-stakes, real-world safety challenges in the natural world.
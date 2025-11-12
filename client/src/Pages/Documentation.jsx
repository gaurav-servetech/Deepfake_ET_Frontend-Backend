import { Link } from "react-scroll";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import DocumentationPara from "../components/DocumentationPara";
import DocumentationTable from "../components/DocumentationTable";

const Documentation = () => {
  return (
    <div>
    <div className="documentation-page">
      <Navbar />
      <div className="documentation-button-and-details">
        <div className="documentation-buttons">
          <Link
            to="doc-section-1"
            spy={true}
            smooth={true}
            offset={-20}
            duration={500}
          >
            <p className="documentation-buttons-pointer">What is Deepfake?</p>
          </Link>
          <ul className="documentation-subpoints">
            <li><Link to="doc-section-1-intro" spy={true} smooth={true} offset={-20} duration={500} className="documentation-subpoint-link">Introduction to Deepfakes</Link></li>
            <li><Link to="doc-section-1-how" spy={true} smooth={true} offset={-20} duration={500} className="documentation-subpoint-link">How Do Deepfakes Work?</Link></li>
            <li><Link to="doc-section-1-types" spy={true} smooth={true} offset={-20} duration={500} className="documentation-subpoint-link">Types of Deepfake Manipulations</Link></li>
            <li><Link to="doc-section-1-danger" spy={true} smooth={true} offset={-20} duration={500} className="documentation-subpoint-link">Why Are Deepfakes Dangerous?</Link></li>
          </ul>
          <Link
            to="doc-section-2"
            spy={true}
            smooth={true}
            offset={-20}
            duration={500}
          >
            <p className="documentation-buttons-pointer">How It Works</p>
          </Link>
          <ul className="documentation-subpoints">
            <li><Link to="doc-section-2-lips" spy={true} smooth={true} offset={-20} duration={500} className="documentation-subpoint-link">Lips Manipulation Detection</Link></li>
            <li><Link to="doc-section-2-face" spy={true} smooth={true} offset={-20} duration={500} className="documentation-subpoint-link">Face Manipulation Detection</Link></li>
            <li><Link to="doc-section-2-audio" spy={true} smooth={true} offset={-20} duration={500} className="documentation-subpoint-link">Audio Manipulation Detection</Link></li>
            <li><Link to="doc-section-2-pipeline" spy={true} smooth={true} offset={-20} duration={500} className="documentation-subpoint-link">End-to-End Detection Pipeline</Link></li>
          </ul>
          <Link
            to="doc-section-3"
            spy={true}
            smooth={true}
            offset={-20}
            duration={500}
          >
            <p className="documentation-buttons-pointer">Upload & Detect</p>
          </Link>
          <ul className="documentation-subpoints">
            <li><Link to="doc-section-3-step1" spy={true} smooth={true} offset={-20} duration={500} className="documentation-subpoint-link">Step 1: Upload a Video</Link></li>
            <li><Link to="doc-section-3-step2" spy={true} smooth={true} offset={-20} duration={500} className="documentation-subpoint-link">Step 2: AI Processing & Analysis</Link></li>
            <li><Link to="doc-section-3-step3" spy={true} smooth={true} offset={-20} duration={500} className="documentation-subpoint-link">Step 3: Get the Results</Link></li>
            <li><Link to="doc-section-3-interpretation" spy={true} smooth={true} offset={-20} duration={500} className="documentation-subpoint-link">Example of Results Interpretation</Link></li>
          </ul>
        </div>
        <div className="documentation">
          <h2 id="doc-section-1">What is Deepfake?</h2>
          <DocumentationPara
            id="doc-section-1-intro"
            title="Introduction to Deepfakes"
            details="Deepfakes are artificially generated or altered videos, images, or audio clips that use artificial intelligence to manipulate content in a way that appears realistic. These manipulations often involve changing a person's face, altering speech, or even creating entirely synthetic voices and characters."
          />
          <DocumentationPara
            id="doc-section-1-how"
            details="Deepfake technology is powered by deep learning techniques, particularly Generative Adversarial Networks (GANs), which train on large datasets of real human faces and voices to generate fake but highly convincing media."
          />
          <DocumentationPara
            id="doc-section-1-types"
            title="How Do Deepfakes Work?"
            details="Deepfake creation typically involves the following steps:"
          />
          <DocumentationTable
            title=""
            listItems={[
              {
                title: "Data Collection ",
                details:
                  " Thousands of images or voice recordings of a person are gathered to train an AI model.",
              },
              {
                title: "Face and Voice Encoding ",
                details: " AI models map facial features and voice patterns.",
              },
              {
                title: "Deep Learning Model Training ",
                details:
                  "A GAN or autoencoder learns to generate and refine synthetic outputs.",
              },
              {
                title: "Manipulation and Rendering ",
                details:
                  "The AI model swaps faces, syncs speech, or clones a voice to create a fake video.",
              },
            ]}
          />
          <DocumentationPara
            id="doc-section-1-types"
            title="Types of Deepfake Manipulations"
          />
          <DocumentationTable
            title=""
            listItems={[
              {
                title: "Face Swapping ",
                details:
                  "One person's face is seamlessly replaced with another's.",
              },
              {
                title: "Lip-Syncing Manipulation ",
                details:
                  "The lip movements in a video are modified to match altered speech.",
              },
              {
                title: "Voice Cloning ",
                details:
                  "AI-generated voices mimic real individuals with high accuracy.",
              },
              {
                title: "Full Body Manipulation  ",
                details:
                  "Entire body gestures and movements are synthesized to create a fake video.",
              },
            ]}
          />
          <DocumentationPara
            id="doc-section-1-danger"
            title="Why Are Deepfakes Dangerous?"
          />
          <DocumentationTable
            title=""
            listItems={[
              {
                title: "Misinformation & Fake News",
                details:
                  " Politicians and public figures can be misrepresented.",
              },
              {
                title: "Fraud & Identity Theft ",
                details:
                  "Scammers can impersonate someone for malicious purposes.",
              },
              {
                title: "	Cybersecurity Threats ",
                details:
                  "Deepfake phishing attacks and video authentication fraud are rising concerns.",
              },
              {
                title: "Social & Psychological Impact",
                details:
                  "False information can manipulate public opinion and damage reputations.",
              },
            ]}
          />
          <DocumentationPara
            details="With the rise of AI-driven manipulations, detecting deepfakes has become essential for digital trust and security."
          />
          <h2 id="doc-section-2">How Our AI Detects Deepfakes</h2>
          <DocumentationPara
            title=""
            details="Our deepfake detection software is built using cutting-edge AI models that analyze three key modalities to determine if a video has been manipulated:"
          />
          <div id="doc-section-2-lips">
            <h2 className="doc-table-title">Lips Manipulation Detection</h2>
            <ul className="why-use-bullet-list">
              <li className="why-use-bullet-item">
                <span>We use AI-based phoneme-to-viseme matching to compare spoken words with lip movements.</span>
              </li>
              <li className="why-use-bullet-item">
                <span>Any mismatch between what is spoken and how the lips move is flagged as suspicious.</span>
              </li>
              <li className="why-use-bullet-item">
                <span>This is particularly useful in detecting lip-synced videos, where a different speech track has been artificially added.</span>
              </li>
            </ul>
          </div>
          <div id="doc-section-2-face">
            <h2 className="doc-table-title">Face Manipulation Detection</h2>
            <ul className="why-use-bullet-list">
              <li className="why-use-bullet-item">
                <span>Our AI models detect unnatural blending of facial features, inconsistencies in skin texture, and unrealistic expressions.</span>
              </li>
              <li className="why-use-bullet-item">
                <span>The model compares the facial structure in different frames to detect frame-to-frame inconsistencies.</span>
                <ul className="why-use-bullet-list sub-bullet-list">
                  <li className="why-use-bullet-item sub-bullet-item"><span>GAN-based analysis for deepfake detection.</span></li>
                  <li className="why-use-bullet-item sub-bullet-item"><span>Checks for unnatural transitions and blending.</span></li>
                </ul>
              </li>
            </ul>
          </div>
          <div id="doc-section-2-audio">
            <h2 className="doc-table-title">Audio Manipulation Detection</h2>
            <ul className="why-use-bullet-list">
              <li className="why-use-bullet-item">
                <span>Our AI analyzes audio waveforms and spectrograms to detect inconsistencies and artificial patterns.</span>
                <ul className="why-use-bullet-list sub-bullet-list">
                  <li className="why-use-bullet-item sub-bullet-item"><span>Detects subtle artifacts from voice cloning and synthetic speech.</span></li>
                  <li className="why-use-bullet-item sub-bullet-item"><span>Flags mismatches between audio and video cues.</span></li>
                </ul>
              </li>
            </ul>
          </div>
          <div id="doc-section-2-pipeline">
            <DocumentationPara title="End-to-End Detection Pipeline" details="" />
            <DocumentationTable
              title=""
              listItems={[
                {
                  title: "Preprocessing",
                  details: "Video is split into frames and audio is extracted.",
                },
                {
                  title: "Feature Extraction ",
                  details:
                    "AI models analyze facial landmarks, phoneme synchronization, and voice patterns.",
                },
                {
                  title: "Deep Learning Evaluation ",
                  details:
                    "A final model decision determines the probability of manipulation.",
                },
                {
                  title: "Confidence Scoring",
                  details:
                    "Results are displayed, showing the likelihood of the video being a deepfake.",
                },
              ]}
            />
          </div>

          <DocumentationPara
            title=""
            details="By combining these techniques, our software provides a robust and accurate deepfake detection system."
          />

          <h2 id="doc-section-3">How to Check if a Video is a Deepfake?</h2>

          <DocumentationPara
            title=""
            details="Using our deepfake detection platform is simple and efficient. Follow these steps:"
          />

          <div id="doc-section-3-step1">
            <h2 className="doc-table-title">Step 1: Upload a Video</h2>
            <ul className="why-use-bullet-list">
              <li className="why-use-bullet-item"><span>Click on the &apos;Upload&apos; button on our platform.</span></li>
              <li className="why-use-bullet-item"><span>Choose a video file (MP4, AVI, MOV, etc.) from your device.</span></li>
              <li className="why-use-bullet-item"><span>The video should be clear, with visible facial features and audible speech for better accuracy.</span></li>
            </ul>
          </div>
          <div id="doc-section-3-step2">
            <h2 className="doc-table-title">Step 2: AI Processing & Analysis</h2>
            <ul className="why-use-bullet-list">
              <li className="why-use-bullet-item"><span>The AI system extracts frames and audio from the video.</span></li>
              <li className="why-use-bullet-item"><span>The deep learning models analyze the video for manipulations in lips, face, and audio.</span></li>
              <li className="why-use-bullet-item"><span>Each frame undergoes a forensic scan to detect irregularities.</span></li>
            </ul>
          </div>
          <div id="doc-section-3-step3">
            <h2 className="doc-table-title">Step 3: Get the Results</h2>
            <ul className="why-use-bullet-list">
              <li className="why-use-bullet-item"><span>A detailed report will be generated indicating if the video is real or manipulated.</span></li>
              <li className="why-use-bullet-item">
                <span>Confidence scores will be provided for:</span>
                <ul className="why-use-bullet-list sub-bullet-list">
                  <li className="why-use-bullet-item sub-bullet-item"><span>✅ Lips Manipulation</span></li>
                  <li className="why-use-bullet-item sub-bullet-item"><span>✅ Face Manipulation</span></li>
                  <li className="why-use-bullet-item sub-bullet-item"><span>✅ Audio Manipulation</span></li>
                </ul>
              </li>
              <li className="why-use-bullet-item"><span>If a deepfake is detected, the report will highlight which part of the video is most suspicious.</span></li>
            </ul>
          </div>
          <div id="doc-section-3-interpretation">
            <DocumentationTable
              title="Example of Results Interpretation"
              listItems={[
                {
                  title: "Low Deepfake Probability (0-30%) ",
                  details: " Likely real",
                },
                {
                  title: "Moderate Deepfake Probability (31-70%) ",
                  details: "Possible manipulation",
                },
                {
                  title: "High Deepfake Probability (71-100%) ",
                  details: "Likely deepfake",
                },
              ]}
            />
          </div>

          <h2 className="doc-section-title" style={{marginTop: '2.5rem'}}>Why Use Our Deepfake Detection Tool?</h2>
          <ul className="why-use-bullet-list">
            <li className="why-use-bullet-item"><span>Fast and accurate analysis.</span></li>
            <li className="why-use-bullet-item"><span>Works on multiple video formats.</span></li>
            <li className="why-use-bullet-item"><span>Provides detailed confidence scores.</span></li>
            <li className="why-use-bullet-item"><span>Easy-to-use interface for both individuals and organizations.</span></li>
          </ul>

          <DocumentationPara
            title=""
            details="This tool ensures that users can quickly verify video authenticity and prevent misinformation, fraud, and identity theft."
          />
        </div>
      </div>
      
    </div>
    <Footer/>
    </div>
    
  );
};

export default Documentation;

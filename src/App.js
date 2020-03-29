import React, { Component } from "react";
import Tesseract from "tesseract.js";
import { Editor } from "@tinymce/tinymce-react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import LoadingOverlay from "react-loading-overlay";
import "./App.css";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      uploads: [],
      patterns: [],
      documents: [],
      text: "",
      status: "",
      loading: false,
      copied: false
    };
  }

  handleChange = event => {
    if (event.target.files[0]) {
      var uploads = [];
      for (var key in event.target.files) {
        if (!event.target.files.hasOwnProperty(key)) continue;
        let upload = event.target.files[key];
        uploads.push(URL.createObjectURL(upload));
      }
      this.setState({
        uploads: uploads
      });
    } else {
      this.setState({
        uploads: []
      });
    }
  };

  generateText = () => {
    let uploads = this.state.uploads;
    if (uploads.length === 0) {
      return alert("Please select image");
    }
    Tesseract.recognize(uploads[0], "eng", {
      logger: m => {
        this.setState({ status: m.status, loading: true, text: "" });
      }
    }).then(({ data: { text } }) => {
      this.setState({ text: text, loading: false, status: "Done." });
    });
  };

  onTextChange = content => {
    this.setState({ text: content });
  };

  render() {
    return (
      <div>
        <LoadingOverlay
          active={this.state.loading}
          spinner
          text={this.state.status}
        >
          <div className="app">
            <header className="header">
              <h1>
                Optical Character Recognition (OCR) <br />
                App
              </h1>
            </header>
            {/* File uploader */}
            <section className="hero">
              <label className="fileUploaderContainer">
                Click here to upload documents
                <input
                  type="file"
                  id="fileUploader"
                  onChange={this.handleChange}
                  multiple
                />
              </label>

              <center>
                {this.state.uploads.map((value, index) => {
                  return (
                    <img key={index} src={value} width="200px" alt="img" />
                  );
                })}
              </center>
              <button onClick={this.generateText} className="button">
                Generate
              </button>
            </section>

            {/* Results */}
            <section className="results">
              <div></div>
              <h1>Result</h1>
              <p>Status : {this.state.status}</p>
              <CopyToClipboard
                text={this.state.text}
                onCopy={() => this.setState({ copied: true })}
              >
                <button className="buttonCopy">Copy to clipboard</button>
              </CopyToClipboard>{" "}
              {this.state.copied ? (
                <span style={{ color: "red" }}>Copied.</span>
              ) : null}
              <br />
              <br />
              <Editor
                value={this.state.text}
                init={{
                  height: 500,
                  menubar: false,
                  plugins: [
                    "advlist autolink lists link image charmap print preview anchor",
                    "searchreplace visualblocks code fullscreen",
                    "insertdatetime media table paste code help wordcount"
                  ],
                  toolbar:
                    "undo redo | formatselect | bold italic backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help"
                }}
                onEditorChange={this.onTextChange}
              />
            </section>
          </div>
          <center>
            <p>
              Made with{" "}
              <span role="img" aria-label="emoji">
                ❤️
              </span>{" "}
              by{" "}
              <a href="https://ajatdarojat45.id" target="blank">
                lazyCode
              </a>
            </p>
          </center>
        </LoadingOverlay>
      </div>
    );
  }
}

export default App;

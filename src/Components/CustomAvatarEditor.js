import React, {Component, useState} from 'react'
import AvatarEditor from 'react-avatar-editor'
import {ImagePicker} from 'react-file-picker'
import {Container, CloseButton, Button, Modal, Row, Col } from "react-bootstrap"
import ModalDialog from 'react-bootstrap/ModalDialog';
import Draggable from 'react-draggable'
import "../Styles/AvatarEditor.scss"

class DraggableModalDialog extends React.Component {
	render() {
		return <Draggable handle=".modal-title"><ModalDialog {...this.props} /></Draggable>
	}
}


class CustomAvatarEditor extends Component {

  constructor(props) {
    super(props);
    this.state = {
        image: "",
        showModal: false,
        showImagePickerModal: true,
        allowZoomOut: false,
        scale: 1,
        newImage: ""
    }
    this.inputFilePicker = null;
    this.showImagePicker = this.showImagePicker.bind(this);
    this.closeImagePicker = this.closeImagePicker.bind(this);
    this.saveImage = this.saveImage.bind(this);
    this.chooseNewImage = this.chooseNewImage.bind(this);
    this.onFilePickerSelection = this.onFilePickerSelection.bind(this); 
  }

  componentDidMount() {
    this.inputFilePicker = React.createRef();
  }
  setEditorRef = (editor) => (this.editor = editor)
  showImagePicker() {
      this.setState({showImagePickerModal: true});
  }

  handleScale = (e) => {
    const scale = parseFloat(e.target.value)
    this.setState({ scale })
  }

  onCrop = () => {

  }
  closeImagePicker(success) {

    this.setState({showImagePickerModal: false})
    if(success) this.props.setImage(this.state.image);
  }

  saveImage() {
    const img = this.editor.getImageScaledToCanvas().toDataURL();
    this.props.imageSaved(img);
    this.props.modalClose();
  }

  chooseNewImage() {
    this.inputFilePicker.current.click();
  }

  onFilePickerSelection(e) {
    if(e.target.files[0]) this.setState({newImage: e.target.files[0]})
  }
  render() {

    
    var imageUrl = this.props.image;
    const showModal= this.props.showModal;
    const modalClose = this.props.modalClose;
    const setImage = this.props.setImage;
    var borderRadius

    if(this.state.newImage) imageUrl = this.state.newImage;
    
    if(imageUrl) borderRadius = 125;
    else borderRadius = 0;
    //console.log("Avatar Editor render", imageUrl, showModal, modalClose);
    return (
       <div>
           <input type="file" 
                ref={this.inputFilePicker} 
                style={{display: "none"}}
                onChange={this.onFilePickerSelection}/>
       <Container>
         <Row className="justify-content-md-center">
            <Col md="auto">
                <Modal
                    style={{
                        marginLeft: "150px",
                        maxWidth: "300px"}}
                    show={showModal} onHide={modalClose}
                    centered>
                    <Container className="justify-content-md-center gradientContainer">
                        {imageUrl ?
                            (
                                <div>
                                <Row style={{marginTop: "10px"}}
                                    className="justify-content-md-center">
                                    <Col md="auto">
                                        <AvatarEditor
                                            ref={this.setEditorRef}
                                            image={imageUrl}
                                            width={250}
                                            height={250}
                                            border={2}
                                            scale={this.state.scale}
                                            borderRadius={borderRadius}
                                        />
                                    </Col>
                                </Row>

                                <Row>
                                    <br/>
                                        <h1 style={{color: "white"}}><b>Zoom</b>:</h1>
                                        <input
                                          name="scale"
                                          type="range"
                                          onChange={this.handleScale}
                                          min={this.state.allowZoomOut ? '0.1' : '1'}
                                          max="2"
                                          step="0.01"
                                          defaultValue="1"
                                        />


                                </Row>
                                </div>
                            )
                        : <div/> }
                        
                        <Row className="justify-content-md-center"
                            style={{marginTop : "10px", marginBottom: "5px"}}>
                            <Col md="auto">
                            {imageUrl ?
                                <Button class="secondary" onClick={this.saveImage}>
                                    Save Image
                                </Button>
                                : <div/>
                            }
                            </Col>
                            <Col md="auto">
                                <Button class="secondary" onClick={this.chooseNewImage}>
                                    Update Image
                                </Button>

                            </Col>
                         </Row>
                         <Row >

                        </Row>
                    </Container>
                </Modal>
            </Col>
         </Row>



      </Container>
      </div>
    )
  }
}

export default CustomAvatarEditor
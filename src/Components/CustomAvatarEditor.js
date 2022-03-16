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
        scale: 1
    }
    this.showImagePicker = this.showImagePicker.bind(this);
    this.closeImagePicker = this.closeImagePicker.bind(this);
    this.saveImage = this.saveImage.bind(this);
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
  render() {

    const imageUrl = this.props.image;
    const showModal= this.props.showModal;
    const modalClose = this.props.modalClose;
    const setImage = this.props.setImage;
    var borderRadius

    if(imageUrl) borderRadius = 125;
    else borderRadius = 0;
    //console.log("Avatar Editor render", imageUrl, showModal, modalClose);
    return (
       <div>
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
                        <Row className="justify-content-md-center">
                            <Col md="auto">

                                 <ImagePicker
                                 extensions={['jpg', 'jpeg', 'png']}
                                 dims={{minWidth: 100, maxWidth: 500, minHeight: 100, maxHeight: 500}}

                                 onChange={base64 => {
                                     console.log("Image chosen:", base64);
                                     this.state.image =  base64
                                     this.closeImagePicker(true);
                                     }
                                 }
                                 onError={errMsg => {
                                     console.log("Image error:", errMsg);
                                     this.state.image = ""
                                     this.closeImagePicker(false);
                                     }
                                 }
                                 >

                                 <Button
                                    color="secondary">
                                   Choose Image
                                 </Button>
                                 </ImagePicker>

                            </Col>
                        </Row>
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
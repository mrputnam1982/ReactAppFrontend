import React, {Component, useState} from 'react';
import {Editor, EditorState, ContentState, RichUtils} from 'draft-js';
export default class RichTextEditor extends Component {

    constructor(props) {

        super(props);
        this.setDomEditorRef = ref => this.domEditor = ref;
        this.handleKeyCommand = this.handleKeyCommand.bind(this);
    }

    componentDidMount(){
      if(this.props.editorState && this.props.onChange) this.domEditor.focus()
    }

    handleKeyCommand(command, editorState) {
        const newState = RichUtils.handleKeyCommand(editorState, command);
        if (newState) {
          this.props.onChange(newState);
          return 'handled';
        }

        return 'not-handled';
    }
    render() {
        const {editorState, onChange} = this.props;
        //console.log(onChange);
        return (

            <div
              style={{ borderRadius: "5px", border: "1px solid lightgrey", minHeight: "6em", cursor: "text" }}
            >
              <Editor
                ref={this.setDomEditorRef}
                editorState={editorState}
                handleKeyCommand={this.handleKeyCommand}
                onChange={onChange}
              />
            </div>
        );
    }
}
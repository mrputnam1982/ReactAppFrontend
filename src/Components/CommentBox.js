  import React, {Component, useState, useRef} from 'react';
import '../Styles/CommentBox.scss'
import cn from 'classnames';

const INITIAL_HEIGHT = 46;
export default class CommentBox extends Component {
    constructor(props) {
        super(props);
        const outerHeight = INITIAL_HEIGHT;
        this.state = ({isExpanded: false});
        this.onExpand = this.onExpand.bind(this);
    }

    onExpand = () => {
		if (!this.state.isExpanded) {
          this.outerHeight = document.scrollHeight;
          this.setState({isExpanded: true});
        }
	}

    render() {
        const { commentValue, handleCommentValue,
         enterCommentLine, submitCommentLine, onClose, isExpanded} = this.props;
         this.state.isExpanded = isExpanded;
         const enableCommentButton = () => {
          return (commentValue ? false : true);
        }
         const changeCommentButtonStyle = () => {
          return (commentValue ? "comments-button-enabled" :
          "comments-button-disabled");
        }


        return (
         <form
             onSubmit={submitCommentLine}
             onChange={handleCommentValue}
             className={cn("comment-box", {
               expanded: isExpanded,
               collapsed: !isExpanded,
                    modified: commentValue.length > 0,
             })}
             style={{
               minHeight: isExpanded ? this.outerHeight : INITIAL_HEIGHT
             }}
           >
         <div className={'header headerComment'}>
             <div className={'user'}>
               <img
                 src="avatar/path"
                 alt="User avatar"
               />
               <span>User Name</span>
             </div>
           </div>
         <div className={'header headerComment'}> ... </div>

           <label className={'label labelComment'} htmlFor="comment">What are your thoughts?</label>
           <textarea

             onClick={this.onExpand}
             onFocus={this.onExpand}
             onChange={handleCommentValue}
             className="comment-field"
             placeholder="What are your thoughts?"
             value={commentValue}
             name="comment"
             id="comment"
            />
         <div className="actions">
             <button type="button" className="cancel" onClick={onClose}>
               Cancel
             </button>
             <button type="submit"  disabled={commentValue.length < 1}>
               Enter
             </button>
         </div>
         </form>
         )

    }
}
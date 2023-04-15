import React from 'react';
import PropTypes from 'prop-types';
import styles from './CommentTitle.scss';

const CommentTitle = (props) => {
  const { isOpened, onHamburgerClick, title } = props;
  const button = isOpened ? '-' : '+';
  return (
    <div className={styles.commentTitle}>
      <span>
        <span>{button}</span>
        <span>{title}</span>
      </span>
      {
        isOpened && (
          <button onClick={onHamburgerClick} className={styles.hamburger} type="button">
            <span className={styles.hamburgerBox} type="button">
              <span className={styles.hamburgerInner} type="button" />
            </span>
          </button>
        )
      }
    </div>
  );
};

CommentTitle.defaultProps = {
  onHamburgerClick: null,
};

CommentTitle.propTypes = {
  isOpened: PropTypes.bool.isRequired,
  onHamburgerClick: PropTypes.func,
  title: PropTypes.string.isRequired,
};

export default CommentTitle;

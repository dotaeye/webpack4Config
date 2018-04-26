import React from "react";
import { getCommonName } from "./common";
import styles from "./topic.less";

export default class Topic extends React.Component {
  render() {
    const { match } = this.props;
    return (
      <div className={styles.Container}>
        <h3>{getCommonName(match.params.topicId)}</h3>
      </div>
    );
  }
}

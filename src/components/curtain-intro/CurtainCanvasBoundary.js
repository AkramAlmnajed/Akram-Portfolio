import { Component } from 'react';

// Error boundary around the curtain <Canvas>. If WebGL context creation throws
// (blocklisted GPU, context limit hit, driver error), it catches the error, calls
// onError so CurtainFabric swaps to the static CSS drape, and renders nothing —
// instead of crashing the app or leaving a black panel. Error boundaries must be
// class components.
export default class CurtainCanvasBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { failed: false };
  }

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch() {
    if (this.props.onError) this.props.onError();
  }

  render() {
    if (this.state.failed) return null;
    return this.props.children;
  }
}

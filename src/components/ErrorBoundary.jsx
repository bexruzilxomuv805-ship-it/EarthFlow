import { Component } from 'react'

// Bir qism (masalan, 3D Yer) xato bersa, butun sahifa o'chib qolmasin
export default class ErrorBoundary extends Component {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  render() { return this.state.failed ? this.props.fallback : this.props.children }
}

import React from 'react'

export default class ErrorBoundary extends React.Component{
  constructor(props){ super(props); this.state = {error: null} }
  static getDerivedStateFromError(error){ return {error} }
  componentDidCatch(error, info){ console.error('ErrorBoundary caught', error, info) }
  render(){
    if(this.state.error){
      return (
        <div style={{padding:20,background:'#0f172a',color:'#fee'}}>
          <h2>Runtime error</h2>
          <pre style={{whiteSpace:'pre-wrap'}}>{this.state.error.toString()}</pre>
        </div>
      )
    }
    return this.props.children
  }
}

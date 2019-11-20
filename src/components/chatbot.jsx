
import React, {Component } from "react";
import Listmessages from './messages';
import Api from '../api.json';
//import bg from '../bgChatbot.png';
import bgh from '../bg_test.png';



import {Button,Grid, Box,InputBase,ButtonGroup} from "@material-ui/core";
import { styled } from '@material-ui/core/styles';
import QrReader from 'react-qr-reader';

import ScrollToBottom from 'react-scroll-to-bottom';

////speech to text
import { css } from 'glamor';
const ROOT_CSS = css({
  height: 550,
  width: 360,
  paddingLeft: '10px'
});





const InputMessagesbox = styled(Box)({ 
  minWidth:'360px',
  marginBottom:"20px",
  borderBottomLeftRadius:"10px",
  borderBottomRightRadius:"10px",
  background: '#eeeeee',
  
});

const CssTextField = styled(InputBase)({
 
    '& label.Mui-focused': {
      color: 'blue',
    },
    '& .MuiInput-underline:after': {
      borderBottomColor: 'blue',
    },
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: 'red',
      },
      '&:hover fieldset': {
        borderColor: 'blue',
      },
      '&.Mui-focused fieldset': {
        borderColor: 'blue',
      },
    },
    borderRadius: 10,
    position: 'relative',
    backgroundColor: '#e0e0e0',
    fontSize: 16,
    width: 'auto',
    padding: '10px 12px',
  
});



class Chatbot extends Component {
    state={
      count:0,
      messagebuffer:[{mode:'',time:0,type:'message',payload:"Hi,I'm CPEchatbot.How can I help you?"}],
      InputMessage:'',
      showqr:false,
      dataqr:''
    };

    constructor() {
        super();
       
        this.handleAddmessage=this.handleAddmessage.bind(this);  
        this.handlemessage=this.handlemessage.bind(this);     
    }

   
    handleChange = event => {
      const {name, value} = event.currentTarget;
      this.setState({[name]: value});
    };

    //add new message to buffer
    handleAddmessage(event){
     this.state.messagebuffer.push(event[0]);
     this.setState({some:event[0],messagebuffer:this.state.messagebuffer});
    }

    //communicate to chatbot
    handlemessage(para){ 
      console.log("---",para);
      this.setState({InputMessage:''});
      var check=false;
      for(let i=0;i<para.length;i++){
        if(para[i].match(/[a-zA-Z0-9]/)){
          check=true;
        }
      }
      
      
      if(check){
        var attr=[]

        if(para.length>150){
          attr=[{mode:'bot',time:0,type:'overmessage',payload:'error'}];
          this.handleAddmessage(attr);
        

        }
        else{
          attr=[{mode:'client',time:0,type:'message',payload:para}];
          this.handleAddmessage(attr);

         

          fetch(Api.Url+para+'&sessionId=2',{
                method:'GET',
                headers: new Headers({
                        'Content-Type': 'application/json',
                        'Authorization': Api.Authorization
                })  
          }).then((res) => {
                return res.json(); 
          }).then((data)=>{
              var m =data.result.fulfillment.messages;
              for(let i=0;i<m.length;i++){
                if(m[i].speech){
                  attr=[{mode:'bot',time:0,type:'message',payload:m[i].speech}];
                  this.handleAddmessage(attr);
                }
              }
              for(let i=0;i<m.length;i++){
                if(m[i].imageUrl){
                  attr=[{mode:'bot',time:0,type:'image',payload:m[i].imageUrl}];
                  this.handleAddmessage(attr);
                }
              }
            


                       


          }).catch((error) => {
                attr=[{mode:'bot',time:0,type:'errormessage',payload:"System Error Please Try Again"}];
                this.handleAddmessage(attr);
          })
        }
      }
     
    }
    
   

   

    //Enter to send messages
    handleKeyPress = (event) => {
      if( event.key ==='Enter' && !event.shiftKey){
        this.handlemessage(this.state.InputMessage);
      }

    }

  
    handleScan = data => {
      if (data!=null) {
        //this.handlemessage(data);
        var attr=[{mode:'bot',time:0,type:'linkmessage',payload:data}];
        this.handleAddmessage(attr); 
        this.setState({showqr:false,dataqr:data});
      }
    }
    
    handleqr = data => {
      
      this.setState({showqr:!this.state.showqr});
    }

    handleError = err => {
      console.error(err)
    }

    render() {
      /* const Messages=this.state.InputMessage; */

      return (
        
        <Grid  container style={{position:"relative",height:'100vh',width:'100%',minWidth:"768px",backgroundImage:`url(${bgh})`,backgroundSize:"cover",backgroundPosition:"center center"}} direction="column"  alignItems="center">

              <div style={{width:'376px',backgroundColor:'lightyellow  ', marginTop: '63px',}}> 

              <ScrollToBottom item className={ ROOT_CSS } >
    
                  {this.state.messagebuffer.map(m=>{
                    /* if(m!==this.state.messagebuffer[this.state.messagebuffer.length-1]){

                        return <div><Listmessages value={m}  /></div>
                      }
                      else{
                        console.log(m);
                        return <div ><Listmessages value={m} /></div>
                      } */

                      if(m.type!=='linkmessage'){
                        return <div><Listmessages value={m}  /></div>
                      }
                      else{
                        return <div><Linkmessage value={this.state.dataqr} handler = {this.handlemessage}/></div>
                      }
                    })}
              </ScrollToBottom>
              </div>

        
            
            <InputMessagesbox  p={1} height={55}  display="flex" justifyContent="center" style={{position:"relative"}}> 
              <Box  component="div" width="100%">
                <CssTextField  id="standard-multiline-static" multiline rows="2"   name="InputMessage"  value={this.state.InputMessage}   variant="outlined" placeholder="Type here"  onKeyDown={this.handleKeyPress}    onChange={this.handleChange} style={{width:"100%"}} /> 
              </Box>
              

              <Box  component="div" style={{marginLeft:'2px'}} >
              <ButtonGroup aria-label="small outlined button group">
                <Button variant="contained" color="primary"   onClick={()=>this.handlemessage(this.state.InputMessage)} style={{width:"50px",height:"100%",margin:"1px"}}>
                     send
                </Button> 

                <Button variant="contained" color="primary"   onClick={()=>this.handleqr()} style={{width:"50px",height:"100%",margin:"1px"}}>
                     qr
                </Button>
                </ButtonGroup>

              </Box>
            </InputMessagesbox>  
            {this.state.showqr &&<div style={{position:"fixed",left:"-125px",top:0,marginLeft:"50%",marginTop:"20%"}}>
            <QrReader
             delay={300}
             onError={this.handleError}
             onScan={this.handleScan}

            style={{ width: '250px' }}
            /></div>

            }
            

        </Grid>
       
        
      );
    }

}


class Linkmessage extends React.Component {

  render() {
    
    return (
      <div>
  <Button variant="outlined" size="small" color="primary" onClick = {() =>this.props.handler(this.props.value)}>Info{this.props.value}</Button>
        <Button variant="outlined" size="small" color="primary" onClick = {() =>this.props.handler('I am at'+this.props.value)}>Go to Other room</Button>
      </div>
    );
   
  }
}

export default Chatbot;

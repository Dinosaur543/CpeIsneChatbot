
import React, {Component } from "react";
import Listmessages from './messages';
import Api from '../api.json';
//import { storiesOf } from "@storybook/react";
//import { Search } from "grommet-icons";
import { Box, Grommet, TextInput, Button } from "grommet";
//import { grommet } from "grommet/themes";
//import { deepMerge } from "grommet/utils";
import { Send } from "grommet-icons";
import * as Scroll from 'react-scroll';
import { Link, Element , Events, animateScroll as scroll, scrollSpy, scroller } from 'react-scroll'


class Chatbot extends Component {
    state={
      count:0,
      messagebuffer:[{mode:'',time:0,type:'message',payload:''}],
     
    };

    constructor() {
        super();
       
        this.handleaddmessage=this.handleaddmessage.bind(this);  
        this.handlemessage=this.handlemessage.bind(this);     
    }

  
    handleaddmessage(event){
     this.state.messagebuffer.push(event[0]);
     this.setState({some:event[0],messagebuffer:this.state.messagebuffer});
    }

    handlemessage(para){
      var attr=[{mode:'client',time:0,type:'message',payload:para}];
      this.handleaddmessage(attr);
    
      fetch(Api.Url+para+'&sessionId=2',{
            method:'GET',
            headers: new Headers({
                    'Content-Type': 'application/json',
                    'Authorization': Api.Authorization
            })  
        })
        .then((res) => {
            return res.json(); 
        }).then((data)=>{
            attr=[{mode:'bot',time:0,type:'message',payload:data.result.fulfillment.speech}];
            this.handleaddmessage(attr);
            console.log(attr);
            var m =data.result.fulfillment.messages;
            for(var i=0;i<m.length;i++){
              if(m[i].imageUrl){
                attr=[{mode:'bot',time:0,type:'image',payload:m[i].imageUrl}];
                this.handleaddmessage(attr);
              }
            }
            this.scrollToWithContainer()
            console.log(data.result.fulfillment.messages[0].speech);
        }).catch((error) => console.log(error))
    }
  
   
    scrollToWithContainer() {

      let goToContainer = new Promise((resolve, reject) => {
  
        Events.scrollEvent.register('end', () => {
          resolve();
          Events.scrollEvent.remove('end');
        });
  
        scroller.scrollTo('scroll-container', {
          duration: 8,
          delay: 0,
          smooth: 'easeInOutQuart'
        });
  
      });
  
      goToContainer.then(() =>
        scroller.scrollTo('test1', {
          duration: 100,
          delay: 0,
          smooth: 'easeInOutQuart',
          containerId: 'scroll-container'
        }));
    }

    handleKeyPress = (event) => {
      if(event.key === 'Enter'){
        this.handlemessage(this.refs.messages.value)
      }
    }
    render() {
    
      
      
      console.log("lenght",this.state.messagebuffer[this.state.messagebuffer.length-1]);
      return (
        <Grommet full={true}  > 
        <Box align="center"  background="dark-1" height="full" >
            <Box  background="linear-gradient(102.77deg, #865ED6 -9.18%, #18BAB9 209.09%)"  overflow={{"vertical": "scroll", "horizontal": "hidden"}} height="80%" width="medium"   round={{ "corner": "bottom"}} id="scroll-container">
              
            {this.state.messagebuffer.map(m=>{
                if(m!==this.state.messagebuffer[this.state.messagebuffer.length-1]){
                  return <Listmessages value={m} name="test1"  />
                }
                else{
                  return <Listmessages value={m} />
                }
            })}
            
            </Box>
            
            <Box margin={{"top":"xsmall"}} width="medium" align="center" direction="row" justify="between">
              <TextInput  type="text" placeholder="Type here" ref="messages" onKeyPress={this.handleKeyPress}/>
              <Button icon={<Send />} margin="xsmall" pad="small" primary className="test1" to="test1" onClick={()=>this.handlemessage(this.refs.messages.value)} />  
            </Box>           
            
        </Box>
       
        </Grommet>
      );
    }
 

}

export default Chatbot;
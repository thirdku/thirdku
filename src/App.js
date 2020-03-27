import React from 'react';
import ReactDOM from 'react-dom';
import 'antd/dist/antd.css';
import './App.css';
import firebase from './configs';
import { Layout, Menu, Typography, Button, Input, Form, Row, Col, Card, Breadcrumb, Modal } from 'antd';
import { DeleteTwoTone, EditTwoTone, CheckCircleTwoTone} from '@ant-design/icons';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
}
from "react-router-dom";



const { Header, Content, Footer } = Layout;
const { Meta } = Card;



class App extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {

    };
  }
  render() {
    return (
      <Layout className="layout">
    <Header>
      <div className="logo" />
      <Router>
      <Menu
        theme="dark"
        mode="horizontal"
        defaultSelectedKeys={['2']}
        style={{ lineHeight: '64px' }}
      >
        <Menu.Item key="1"><Link to="/content1">Content 1</Link></Menu.Item>
        <Menu.Item key="2"><Link to="/content2">Content 2</Link></Menu.Item>
        <Menu.Item key="3"><Link to="/content3">Content 3</Link></Menu.Item>
      </Menu>
      <Switch>
          <Route exact path="/content1">
            <Content1 />
          </Route>
          <Route path="/content2">
            <Content2 />
          </Route>
          <Route path="/content3">
            <Content3 />
          </Route>
        </Switch>
      </Router>
    </Header>
     <Layout className="layout">
  <Content style={{ padding: '35px' }}>
      <Breadcrumb style={{ margin: '16px 0' }}>
        <Breadcrumb.Item></Breadcrumb.Item>
        <Breadcrumb.Item></Breadcrumb.Item>
        <Breadcrumb.Item></Breadcrumb.Item>
      </Breadcrumb>
      <div className="site-layout-content" />
       </Content>
    <Footer style={{ textAlign: 'center' }}>'no'</Footer></Layout>
  </Layout>
    );
  }
}

function Content1() {
  return (
   <div className="todoform"><ToDoForm db={firebase}/></div>
    );
}


function Content2() {
  return (<div className="div-content"><h2>About</h2>
  <Content style={{ padding: '0px 0px' }}>
      
      <div className="content">Content</div>
    </Content></div>);
}

function Content3() {
  return (<div className="div-content"><h2>Usersd</h2></div>);
}




class ToDoForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = { text: '', items: [],  title: '', item_id:'' };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.showModal = this.showModal.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
    this.updateItem = this.updateItem.bind(this);

  }
  componentDidMount(){
    const itemsRef = firebase.database().ref('items');
    itemsRef.on('value',(snapshot) => {
        let items = snapshot.val();
        let newState = [];
        for(let item in items){
          newState.push({
              item_id:item,
              title:items[item].title,
              text:items[item].text,
              selected:items[item].selected
          });
        }
        this.setState({
          items:newState
        });
    });
  }
  formRef = React.createRef();

  handleCancel = e => {
    console.log(e);
    this.formRef.current.resetFields();
    this.setState({
      visible: false,
    });
  };
  showModal() {
    this.setState({
      visible: true,
     
    });
  }
  handleChange(e) {
    this.setState({ [e.target.name]: e.target.value
});
  }
  handleSubmit(e){
    e.preventDefault();
          this.formRef.current.resetFields();

    const itemsRef = firebase.database().ref('items');
    const item = {
       title : this.state.title,
       text : this.state.text,
       selected:false

    };
    itemsRef.push(item);
    this.setState({
       item_id:'',
       title:'',
       text:'',
      visible:false

    });
 }
 
 
  handleUpdate = (index,selected) => {
    this.state.items[index].selected = true;
    this.setState({selected});
  }
 handleInputChange(index, e) {
    this.state.items[index].text = e.target.value;
    this.forceUpdate();
     }
     handleInputChangeTitle(index, e) {
    this.state.items[index].title = e.target.value;
    this.forceUpdate();
     }
  updateItem(index,e,itemId){
 e.preventDefault();
      var obj = { title:this.state.items[index].title,text:this.state.items[index].text,selected:false };
 
      const itemsRef = firebase.database().ref('/items');
 
      itemsRef.child(itemId).update(obj);
 
      this.setState({
        item_id:'',
        title:'',
        text:'',
      });
 
  }
 
  removeItem(itemId){
    console.log(itemId);
    const itemsRef = firebase.database().ref('/items');
    itemsRef.child(itemId).remove();
 }
 
  
  
  
  render() {
    return (<div >           <Row   gutter={[16,16]}>
                               {this.state.items.map((item,index) => (this.state.items[index].selected === false ?
                                      <Col key={index}  span={8}>
                                <Card className="card"
                                actions={[
                                <DeleteTwoTone  onClick={()=>this.removeItem(item.item_id)} 
                                />,<EditTwoTone onClick={()=>this.handleUpdate(index,item.selected)} />]}>            
                                <Meta title={item.title}
                                  description={item.text}
                                  />
                                </Card>
                                 </Col>
                                  :
                                 <Col key={index} span={8}>
                                <Card  className="card"
                                actions={[
                                <DeleteTwoTone  onClick={()=>this.removeItem(item.item_id)} 
                                />,<CheckCircleTwoTone onClick={(e)=>this.updateItem(index,e,item.item_id)}/>]}>            
                                <Meta title={<Input name="title" size="small" onChange={(e)=>this.handleInputChangeTitle(index,e)} value={this.state.items[index].title}></Input>}
                                  description={<Input name="text" size="small" onChange={(e)=>this.handleInputChange(index,e)} value={this.state.items[index].text}></Input>}
                                  />
                                </Card>
                                 </Col>
                                  )
                                  )}                                
                            </Row>

                                
                       <Modal title = "Your Todo"
                       visible = { this.state.visible }
                       onOk = { this.handleSubmit }
                       onCancel = { this.handleCancel } >
                        <Form className="form" 
                              ref={this.formRef}
                              layout="vertical"
                              >
                          <Form.Item
                                 name="title"
                                 label="Title"
                                 rules={[
                                   {
                                     required: true,
                                     message: 'Please input the title of the todo!',
                                   },
                                 ]}
                               >
                                 <Input name="title" onChange = { this.handleChange }
                                        value = { this.state.title } ></Input>
                          </Form.Item >
                          <Form.Item name="description" 
                                     label="Description">
                                  <Input name="text"
                                      onChange={this.handleChange}
                                      value={this.state.text}></Input>
                                   
                          </Form.Item>

                            </Form> 
                            </Modal>
<Button  onClick={this.showModal}
className = "button"
 type = "primary"
 shape = "circle">+</Button>
                        </div>);
  }
}

export default App;

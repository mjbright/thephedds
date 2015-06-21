var ds = deepstream( 'http://thephedds.com:6020' )
ds.login({ username: 'ds-simple-input-' + ds.getUid() });

var emitter = new EventEmitter();

var UsersList = React.createClass({
  getInitialState: function() {
    return {
      users: []
    }
  },
  componentDidMount: function() {
    var list = ds.record.getList( 'users' );
    list.subscribe(function(entries) {
      this.setState({users:entries});
    }.bind(this));

    emitter.addListener('user-added', function( recordName ) {
      list.addEntry( recordName );
    });

    emitter.addListener('user-removed', function( recordName ) {
      list.removeEntry( recordName );
    });
  },
  render: function() {
    var users = [];
    for( var i=0; i < this.state.users.length; i++ ) {
      users.push(<User recordName={this.state.users[i]}/>);
    }
    return (
      <div>
        <ul className="users">{users}</ul>
        <AddUser/>
      </div>
    );
  }
});

var User = React.createClass({
  getInitialState: function() {
    return {
      isActive: false,
      firstname: '',
      lastname: '',
      title: ''
    }
  },
  componentDidMount: function() {
    var record = ds.record.getRecord( this.props.recordName );
    record.subscribe(function(data) {
      this.setState(data);
    }.bind(this));

    emitter.addListener('user-selected', function( recordName ) {
      this.setState({isActive: false});
    }.bind(this));
  },
  render: function() {
    return (
      <li className={this.state.isActive ? 'active' : 'bla'}
          onClick={this.selectUser}>
        <em>
          <span>{this.state.firstname}</span>
          &nbsp;
          <span>{this.state.lastname}</span>
        </em>
        <span>{this.state.title}</span>
        <div className="delete-button fa fa-remove" onClick={this.deleteUser}></div>
      </li>
    );
  },
  deleteUser: function() {
    emitter.emit('user-removed', this.props.recordName);
  },
  selectUser: function() {
    emitter.emit('user-selected', this.props.recordName);
    this.setState({isActive:true});
  }
});

var AddUser = React.createClass({
  render: function() {
    return (
      <div className="addUser" onClick={this.addUser}>
        <i className="fa fa-plus"></i>
        <span>add user</span>
      </div>
    );
  },
  addUser: function() {
    var recordName = 'users/' + ds.getUid();
    var record = ds.record.getRecord( recordName );
    record.set({
      firstname: 'New',
      lastname: 'User',
      title: '-'
    });
    emitter.emit('user-added', recordName);
  }
});

var UserDetails = React.createClass({
  getInitialState: function() {
    this.record = ds.record.getAnonymousRecord();
    return {}
  },
  componentDidMount: function() {
    emitter.addListener('user-selected', function( recordName ) {
      this.record.setName(recordName);
    }.bind(this));
  },
  render: function() {
    return (
      <div>
        <fieldset>
  				<legend>General data</legend>
  				<ul className="fields">
            <UserListEntry record={this.record} field='firstname' label='Firstname'/>
            <UserListEntry record={this.record} field='lastname' label='Lastname'/>
            <UserListEntry record={this.record} field='title' label='Title'/>
  				</ul>
  			</fieldset>

  			<fieldset>
  				<legend>Address</legend>
				    <ul className="fields">
              <UserListEntry record={this.record} field='street' label='Street'/>
              <UserListEntry record={this.record} field='number' label='Nr'/>
              <UserListEntry record={this.record} field='postcode' label='Post Code'/>
              <UserListEntry record={this.record} field='city' label='City'/>
            </ul>
  			</fieldset>
      </div>
    );
  }
});

var UserListEntry = React.createClass({
  getInitialState: function() {
    return {
      value: null
    }
  },
  componentDidMount: function() {
    var record = this.props.record.subscribe(this.props.field, function(newValue) {
        this.setState({value: newValue});
    }.bind(this));

    this.setState({value: this.props.record.get(this.props.field)});
  },
  render: function() {
    return (
      <li>
        <label>{this.props.label}</label>
        <input value={this.state.value} onChange={this.onChange} id={this.props.field} type="text" />
      </li>
    );
  },
  onChange: function(event) {
    this.setState({value: event.target.value});
    this.props.record.set(this.props.field, event.target.value);
  }
});

React.render(
  <div id="wrapper">
		<div className="col left">
      <UsersList/>
		</div>
		<div className="col right">
      <UserDetails />
		</div>
	</div>,
  document.body
);

function speakerButtonClickHandler(e) {
  this.classList.toggle('active');

  if (this.classList.contains('active')) {
    Nexpaq.API.Module.SendCommand(Nexpaq.Arguments[0], 'Connect', []);
  } else {
    Nexpaq.API.Module.SendCommand(Nexpaq.Arguments[0], 'Disconnect', []);
  }
}

function defaultStateSwitchClickHandler(e) {
  if(this.checked) {
    Nexpaq.API.Module.SendCommand(Nexpaq.Arguments[0], 'SetDefaultStateAsOn', []);
  } else {
    Nexpaq.API.Module.SendCommand(Nexpaq.Arguments[0], 'SetDefaultStateAsOff', []);
  }
}

function requestStatus() {
  Nexpaq.API.Module.SendCommand(Nexpaq.Arguments[0], 'StatusCheck', []);
}

document.addEventListener('NexpaqAPIReady', function () {
  Nexpaq.API.Module.addEventListener('DataReceived', function (event) {
    // we don't care about data not related to our module
    if (event.module_uuid != Nexpaq.Arguments[0]) return;
    if (event.data_source == 'StateChangeResponse' && event.variables.result == 'success') {
      requestStatus();
    }
    if (event.data_source == 'StatusRequestResponse') {
      if (event.variables.status == 'connected') {
        document.getElementById('speaker-button').classList.add('active');
      } else if(event.variables.status == 'disconnected') {
        document.getElementById('speaker-button').classList.remove('active');
      }
      if(Nexpaq.Arguments[2] == 'moduware.module.speaker') {
				if(event.variables.defaultState == 'connected') {
					document.getElementById('default-state-switch').checked = true;
				} else if(event.variables.defaultState == 'disconnected') {
					document.getElementById('default-state-switch').checked = false;
				}
			}
    }

  });

  requestStatus();
});

/* =========== ON PAGE LOAD HANDLER */
document.addEventListener("DOMContentLoaded", function (event) {
  Nexpaq.Header.create('Speaker');
  Nexpaq.Header.customize({ color: "white", iconColor: "white", backgroundColor: "#E1514C" });
  Nexpaq.Header.hideShadow();

  document.getElementById('speaker-button').addEventListener('touchstart', speakerButtonClickHandler);
  document.getElementById('default-state-switch').addEventListener('click', defaultStateSwitchClickHandler);
  if (typeof(Nexpaq.Arguments) != 'undefined' && Nexpaq.Arguments[2] == 'nexpaq.module.speaker') {
    document.getElementById('default-state-control').style.display = 'none';
  }
});

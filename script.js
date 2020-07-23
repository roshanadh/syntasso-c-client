const socketConnection = io.connect('http://localhost:8081/');
let socketId;
socketConnection.on('connect', () => {
	socketId = socketConnection.id;
	console.log('socketId is: ' + socketId);
});

const codeEditor = document.getElementById('code-editor');
const dockerConfigField = document.getElementById('dockerConfig');
const runBtn = document.getElementById('runBtn');

const clearBtn = document.getElementById("clearBtn");
const stdoutContainer = document.getElementById('stdout-container');

runBtn.addEventListener('click', (event) => {
	event.preventDefault();
	const code = codeEditor.value;
	const dockerConfig = dockerConfigField.value;
	const payload = {
		"code": `${code}`,
		"socketId": `${socketId}`,
		"dockerConfig": `${dockerConfig}`
	}
	if (code && code.trim() !== '') {
		try {
			fetch('http://localhost:8081/submit', {
				method: 'POST',

				body: JSON.stringify(payload),
				headers: {
					'content-type': 'application/json'
				},
				credentials: 'include',
			})
				.then(response => {
					return response.json();
				})
				.then(res => console.log(res))
		} catch (err) {
			console.err(err);
		}
	}
});

clearBtn.addEventListener('click', event => {
	stdoutContainer.innerHTML = "";
});


socketConnection.on('docker-app-stdout', stdout => {
	stdoutContainer.innerHTML += stdout.stdout + '<br />';
});


socketConnection.on('test-status', stdout => {
	console.dir({
		message: "test-status-event",
		...stdout
	});
});

socketConnection.on('container-id', containerId => {
	console.log(containerId.containerId);
});
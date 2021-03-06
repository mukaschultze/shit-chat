<script context="module" lang="ts">
	export const prerender = true;
</script>

<script lang="ts">
	import { browser } from '$app/env';
	import { DateTime, Settings } from 'luxon';
	import { onMount, tick } from 'svelte';

	let messageContent = '';
	let messages = [];
	let scrollView: HTMLElement;

	if (browser) {
		onMount(async () => {
			Settings.defaultLocale = navigator.language;

			var r = document.querySelector<HTMLElement>(':root');
			var color = `hsl(${Math.random() * 360}, 60%, 53%)`;

			r.style.setProperty('--accent', color);
		});

		onMount(async () => {
			const evtSource = new EventSource('//chat.mibdev.com/stream');

			evtSource.addEventListener('message', async (ev) => {
				const scrollToBottom =
					scrollView.scrollTop > scrollView.scrollHeight - scrollView.clientHeight - 50;
				const newMessage = JSON.parse(ev.data);
				messages = [...messages, newMessage];

				if (scrollToBottom || newMessage.mine) {
					await tick();
					scrollView.scroll({ behavior: 'smooth', left: 0, top: scrollView.scrollHeight });
				}
			});
			evtSource.addEventListener('open', (ev) => console.log(`Connected to ${evtSource.url}`, ev));
			evtSource.addEventListener('error', (ev) => console.error(ev));
		});
	}

	async function submit(event: Event) {
		event.preventDefault();

		messageContent = messageContent.trim();

		if (!messageContent) return;

		const message = {
			content: messageContent
		};

		messageContent = ''; // reset message

		const options = {
			method: 'POST',
			body: JSON.stringify(message),
			headers: {
				'Content-Type': 'application/json'
			}
		};

		const res = await fetch('//chat.mibdev.com/messages', options);
		const response = await res.json();
	}
</script>

<svelte:head>
	<title>Shit Chat</title>
	<link rel="shortcut icon" type="image/jpg" href="https://robohash.org/shitchat.png?set=set4" />
	<link rel="icon" type="image/jpg" href="https://robohash.org/shitchat.png?set=set4" />
</svelte:head>

<ul class="chat" bind:this={scrollView}>
	<li class="no-more-items">Older messages will not be available</li>
	<li class="no-more-items">
		This project is a tribute to <a href="https://github.com/BrunoS3D/xit-xat"
			>Bruno Silva's Xit-Xat</a
		>
	</li>
	<li class="no-more-items">
		Source code available at <a href="https://github.com/mukaschultze/shit-chat">GitHub</a>
	</li>
	{#each messages as message (message.id)}
		<li class:sent={message.mine} class="message">
			<img src={message.avatar} />
			{message.content}
			<span class="time">{DateTime.fromISO(message.date).toLocaleString(DateTime.TIME_SIMPLE)}</span
			>
		</li>
	{/each}
</ul>

<form on:submit={submit}>
	<input placeholder="Type your shit..." bind:value={messageContent} />
	<button type="submit">Send!</button>
</form>

<style lang="scss">
	@import url('https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap');

	:root {
		--accent: #7c40ff;
	}

	:global(*) {
		color: #fff;
		font-family: 'Roboto', sans-serif;
	}

	:global(body) {
		background: #444;
	}

	:global(#svelte) {
		margin: 0 auto;
		max-width: 1000px;
	}

	ul.chat {
		width: 100%;
		list-style: none;
		display: flex;
		flex-direction: column;

		overflow: auto;
		padding: 0 20px;
		max-height: calc(100vh - 85px);

		.no-more-items {
			text-align: center;
			color: grey;

			a {
				color: var(--accent);
			}
		}

		li.message {
			width: fit-content;
			max-width: 700px;
			background: #333;
			padding: 14px;
			border-radius: 5px 20px 20px 5px;

			line-break: anywhere;
			word-break: break-word;

			img {
				max-height: 30px;
				vertical-align: bottom;
			}

			.time {
				opacity: 0.5;
				margin-top: 6px;
				font-size: 14px;
				display: block;
				text-align: left;
			}

			+ li {
				margin-top: 8px;
			}

			&.sent {
				align-self: flex-end;
				background: var(--accent);
				border-radius: 20px 5px 5px 20px;
				.time {
					text-align: right;
				}
			}

			&.sent + &:not(.sent) {
				border-radius: 20px 20px 20px 5px;
			}

			&:not(.sent) + &.sent {
				border-radius: 20px 20px 5px 20px;
			}
		}
	}

	form {
		width: 100%;
		display: flex;

		input {
			flex: 1;
			border: none;
			background: #222;
			padding: 14px;
			border-radius: 20px;
		}

		button {
			margin-left: 8px;
			background: var(--accent);
			border: none;
			border-radius: 20px;
			padding: 14px;
		}
	}
</style>

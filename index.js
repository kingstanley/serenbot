
const { App } = require("@slack/bolt");
const  mongoose = require("mongoose");
const Survey = require('./survey');

 

const app = new App({
    token: 'xoxb-3039031695383-3086586058736-vZLd69Q4vUu3Ey4EhxM9tBeC', //Find in the Oauth  & Permissions tab
    signingSecret: "39b8a9b27ea90d6caf37109658b61a84", // Find in Basic Information Tab
    socketMode: true,
    appToken: "xapp-1-A031X3E6TV2-3086557580320-075c8590243049b32899e390b6ef235e3f191e30fe33948a66f006de49feaaa6" // Token from the App-level Token that we created
});

const port =process.env.PORT | 3000;

const connection = mongoose.connect('mongodb+srv://kingstanley:Nj12063@cluster0.6noj5.mongodb.net/myFirstDatabase?retryWrites=true&w=majority');

app.command('/bot', async ({ command, ack, say }) => {
try {
    await ack();
  say({
	"blocks": [
		
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": "Welcome. How are you doing?"
			},
			"accessory": {
				"type": "static_select",
				"placeholder": {
					"type": "plain_text",
					"text": "Pick a feeling...",
					"emoji": true
				},
				"options": [
				 
					{
						"text": {
							"type": "plain_text",
							"text": "Neutral",
							"emoji": true
						},
						"value": "Neutral"
					},
					{
						"text": {
							"type": "plain_text",
							"text": "Doing Well",
							"emoji": true
						},
						"value": "Doing Well"
          },
          	{
						"text": {
							"type": "plain_text",
							"text": "Feeling Locky",
							"emoji": true
						},
						"value": "Feeling Lucky"
					}
				],
				"action_id": "question1"
			}
		}
	]
})
} catch (error) {
  console.log('Error@Bot command: ',error.message)
}
})
 

app.action('question1', async ({ body, ack, say }) => {
  try {
    await ack();
  console.log("Body: ", body.actions[0].selected_option);

  const survey = await Survey.create({
    question: "Welcome. How are you doing?",
    user_id: body.user.id,
    username: body.user.name,
    answer: [body.actions[0].selected_option.value]
  });
  console.log("Saved survey: ", survey);
  // await say(`<@${body.user.id}> clicked the button`);
  await say({
    "replace_original": "true",
    "blocks": [
    
      {
        "type": "section",
        "text": {
          "type": "mrkdwn",
           "text": "What are your favorite hobbies?"
        },
        "accessory": {
          "type": "multi_static_select",
          "placeholder": {
            "type": "plain_text",
            "text": "Select hobbies",
            "emoji": true
          },
          "options": [
				  

            {
              "text": {
                "type": "plain_text",
                "text": "Football",
                "emoji": true
              },
              "value": "Football"
            },
            {
              "text": {
                "type": "plain_text",
                "text": "Music",
                "emoji": true
              },
              "value": "Music"
            },
            {
              "text": {
                "type": "plain_text",
                "text": "Sleep",
                "emoji": true
              },
              "value": "Sleep"
            },	{
              "text": {
                "type": "plain_text",
                "text": "Movies",
                "emoji": true
              },
              "value": "Movies"
            },	{
              "text": {
                "type": "plain_text",
                "text": "Basketball",
                "emoji": true
              },
              "value": "Basketball"
            }
          ],
          "action_id": "question2"
        }
      }
    ]
  })
  } catch (error) {
    console.log("Error@Question1: ",error.message)
  }
});

app.action('question2', async ({ body, ack, say }) => {
 try {
    const answer = body.actions[0].selected_options.map(data =>data.value);
  const survey = await Survey.create({
    question: "What are your favorite hobbies?",
    user_id: body.user.id,
    username: body.user.name,
    answer: answer
  });
  console.log("Saved survey: ", survey);
  await ack();
  await say('Thank You!')
 } catch (error) {
   console.log("Error@Question2: ",error.message)
 }
}
  )

 



app.start(port,async (message) => {
    console.log(`bot started on port: `, port);
  console.log('message: ', message);
  const con = await connection();
  console.log("con: ",con)
})
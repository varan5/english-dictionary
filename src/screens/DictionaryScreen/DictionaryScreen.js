import React, {useState} from 'react';
import {Text, Alert, View, StyleSheet} from 'react-native';
import {Searchbar} from 'react-native-paper';
import axios from 'axios';
import {Avatar, Button, Card, Title, Paragraph} from 'react-native-paper';
import Sound from 'react-native-sound';
import {ActivityIndicator, Colors} from 'react-native-paper';
import {Provider, Dialog, Portal} from 'react-native-paper';
import {List} from 'react-native-paper';

const BASE_URL = 'https://api.dictionaryapi.dev/api/v2/entries/en/';

const DictionaryScreen = () => {
  const handlePress = () => setExpanded(!expanded);
  const [visible, setVisible] = React.useState(false);

  const showDialog = () => setVisible(true);

  const hideDialog = () => setVisible(false);

  const showAlertDialog = (title, message) => {
    Alert.alert(title, message, [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {text: 'OK', onPress: () => console.log('OK Pressed')},
    ]);
  };

  const [searchQuery, setSearchQuery] = useState('');

  const [loader, setLoader] = useState(false);
  const [data, setData] = useState({
    word: 'welcome',
    phonetic: 'ˈwɛlkəm',
    phonetics: [
      {
        text: 'ˈwɛlkəm',
        audio:
          '//ssl.gstatic.com/dictionary/static/sounds/20200429/welcome--_gb_1.mp3',
      },
    ],
    origin:
      'Old English wilcuma  ‘a person whose coming is pleasing’, wilcumian (verb), from wil- ‘desire, pleasure’ + cuman ‘come’. The first element was later changed to wel- ‘well’, influenced by Old French bien venu or Old Norse velkominn .',
    meanings: [
      {
        partOfSpeech: 'noun',
        definitions: [
          {
            definition: 'an instance or manner of greeting someone.',
            example: 'you will receive a warm welcome',
            synonyms: [
              'greeting',
              'salutation',
              'hail',
              'welcoming',
              'reception',
              'warm reception',
              'favourable reception',
              'acceptance',
              'hospitality',
              'red carpet',
              'fáilte',
            ],
            antonyms: ['farewell', 'rebuff'],
          },
        ],
      },
      {
        partOfSpeech: 'exclamation',
        definitions: [
          {
            definition: 'used to greet someone in a polite or friendly way.',
            example: 'welcome to the Wildlife Park',
            synonyms: [],
            antonyms: [],
          },
        ],
      },
      {
        partOfSpeech: 'verb',
        definitions: [
          {
            definition: 'greet (someone arriving) in a polite or friendly way.',
            example: 'hotels should welcome guests in their own language',
            synonyms: [
              'greet',
              'say hello to',
              'salute',
              'bid someone welcome',
              'play host/hostess to',
              'show hospitality to',
              'receive',
              'meet',
              'embrace',
              'receive with open arms',
              'roll out the red carpet for',
              'fete',
              'usher in',
            ],
            antonyms: ['shun', 'spurn'],
          },
        ],
      },
      {
        partOfSpeech: 'adjective',
        definitions: [
          {
            definition: '(of a guest or new arrival) gladly received.',
            example: "I'm pleased to see you, lad—you're welcome",
            synonyms: [
              'gladly received',
              'wanted',
              'appreciated',
              'popular',
              'desirable',
              'acceptable',
              'accepted',
            ],
            antonyms: ['unwelcome'],
          },
          {
            definition: 'very pleasing because much needed or desired.',
            example: 'after your walk, the tea room serves a welcome cuppa',
            synonyms: [
              'pleasing',
              'agreeable',
              'encouraging',
              'gratifying',
              'heartening',
              'promising',
              'refreshing',
              'favourable',
              'propitious',
              'cheering',
              'much needed',
              'pleasant',
              "to one's liking",
              "to one's taste",
            ],
            antonyms: ['unpleasant', 'disappointing'],
          },
          {
            definition: 'allowed or invited to do a specified thing.',
            example:
              'we arrange a framework of activities which you are welcome to join',
            synonyms: [],
            antonyms: [],
          },
        ],
      },
    ],
  });
  const [expanded, setExpanded] = React.useState(true);

  const onChangeSearch = query => {
    setSearchQuery(query);
    console.log('Search result: ', searchQuery);
  };

  const onSubmit = async () => {
    if (searchQuery == '') {
      showAlertDialog('Enter a word', 'Enter a word in the search bar!');
      return;
    }
    setLoader(true);
    const headers = {
      'Content-Type': 'application/json;charset=UTF-8',
      'Access-Control-Allow-Origin': '*',
    };
    const URL = BASE_URL + searchQuery;
    console.log('URl: ', URL);
    await axios
      .get(URL, {
        headers: headers,
      })
      .then(response => {
        setData(response.data[0]);
        console.log('Data Response: ', data);
        setLoader(false);
      })
      .catch(error => {
        console.log('Error: ', error);
        setLoader(false);
        showAlertDialog(
          'Meaning not found!',
          'Enter a relevent word to get the meaning',
        );
      });
    console.log('Submited');
  };

  return (
    <View style={styles.containerView}>
      <Searchbar
        placeholder="Search words"
        onChangeText={onChangeSearch}
        value={searchQuery}
        onSubmitEditing={onSubmit}
        autoCapitalize="none"
      />

      {loader ? (
        <ActivityIndicator
          style={styles.loaderStyle}
          animating={true}
          size={40}
          color={Colors.teal200}
        />
      ) : (
        <View>
          <Card>
            <Card.Content>
              <Title>Word: {data.word}</Title>
            </Card.Content>
          </Card>
          <List.Section title="">
            <List.Accordion
              title="Meaning with example 1"
              left={props => <List.Icon {...props} icon="spellcheck" />}>
              <List.Item
                titleNumberOfLines={5}
                title={`Meaning: \n  ${data.meanings[0].definitions[0].definition}`}
              />
              <List.Item
                titleNumberOfLines={5}
                title={`Example: \n  ${data.meanings[0].definitions[0].example}`}
              />
            </List.Accordion>

            {data.meanings.length > 1 ? (
              <List.Accordion
                title="Meaning with example 2"
                left={props => <List.Icon {...props} icon="spellcheck" />}>
                <List.Item
                  titleNumberOfLines={5}
                  title={`Meaning: \n  ${data.meanings[1].definitions[0].definition}`}
                />
                <List.Item
                  titleNumberOfLines={5}
                  title={`Example: \n  ${data.meanings[1].definitions[0].example}`}
                />
              </List.Accordion>
            ) : (
              <Text></Text>
            )}

            {data.meanings.length > 2 ? (
              <List.Accordion
                title="Meaning with example 3"
                left={props => <List.Icon {...props} icon="spellcheck" />}>
                <List.Item
                  titleNumberOfLines={5}
                  title={`Meaning: \n  ${data.meanings[2].definitions[0].definition}`}
                />
                <List.Item
                  titleNumberOfLines={5}
                  title={`Example: \n  ${data.meanings[2].definitions[0].example}`}
                />
              </List.Accordion>
            ) : (
              <Text></Text>
            )}
          </List.Section>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  containerView: {},
  loaderStyle: {
    marginTop: 100,
  },
  alertDialogStyle: {
    marginTop: 500,
  },
});

export default DictionaryScreen;

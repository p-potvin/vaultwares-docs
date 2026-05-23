import { translate } from '@vitalets/google-translate-api'; translate('Hello world', {to: 'fr-CA'}).then(res => console.log(res.text));

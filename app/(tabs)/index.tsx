import { Text } from 'react-native';
import { getTranslation } from '../../helpers';

export default function Page() {
  return <Text>{ getTranslation( 'Home' ) }</Text>;
}
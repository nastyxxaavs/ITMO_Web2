import { TypeInput } from 'supertokens-node/types';

export type SupertokensConfig = Omit<TypeInput, 'recipeList'>;

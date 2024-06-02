import { useCallback, useMemo } from "react";
import { useRealm } from "@realm/react"

import Realm from "realm";
import { confirmation } from "../helpers";
import { useAccount } from "./useAccount";
import { Transfer } from "../models/Transfer";
import { useI18n } from "../components/contexts/I18nContext";
import { useTypes } from "./useTypes";

interface useTransferProps {
	_id: Realm.BSON.UUID,
	account_id: Realm.BSON.UUID
}

export const useTransfer = ( { _id, account_id }: useTransferProps ) => {
	const { __ } = useI18n();
	const realm = useRealm();
	const { account, getTransferById } = useAccount( { id: account_id } );
	const transfer = useMemo( () => {
		const transfer = getTransferById( _id );
		return transfer;
	}, [ account ] );
	
	const { TransferTypes } = useTypes();
	const [ deposit, withdrawal, dividend ] = TransferTypes;
	const type = transfer?.isValid() && (
		!! transfer?.holding_id
			? dividend
			: transfer?.amount > 0
				? deposit
				: withdrawal
	);

	const saveTransfer = useCallback( ( editedTransfer: Transfer ) => {
		const title = __( 'Save Transfer' );
		const message = __( 'Are you sure?' );

		return new Promise( ( resolve, _ ) => {
			confirmation( {
				title,
				message,
				onAccept() {
					resolve( realm.write( () => {
						Object.assign( transfer, { ...editedTransfer } );
					} ) );
				}
			} );
		} );
	}, [ transfer, account ] );

	const removeTransfer = useCallback( () => {
		const title = __( 'Remove Transfer' );
		const message = __( 'Are you sure?' );

		return new Promise( ( resolve, _ ) => {
			confirmation( {
				title,
				message,
				onAccept() {
					resolve( realm.write( () => {
						const index = account.transfers.findIndex( transfer => {
							return transfer._id.equals( _id );
						} );
						
						account.transfers.remove( index );
					} ) );
				}
			} );
		} );
	}, [ transfer, account ] );

	return {
		transfer, saveTransfer, removeTransfer,
		account,
		type
	}
}
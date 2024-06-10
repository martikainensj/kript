import { useCallback, useMemo } from "react";
import { useRealm } from "@realm/react"

import Realm from "realm";
import { confirmation } from "../helpers";
import { Adjustment } from "../models/Adjustment";
import { useHolding } from "./useHolding";
import { useI18n } from "../components/contexts/I18nContext";
import { useTypes } from "./useTypes";

interface useAdjustmentProps {
	_id: Realm.BSON.UUID,
	holding_id: Realm.BSON.UUID,
	account_id: Realm.BSON.UUID,
}

export const useAdjustment = ( { _id, holding_id, account_id }: useAdjustmentProps ) => {
	const { __ } = useI18n();
	const realm = useRealm();
	const {
		holding,
		transactions,
		adjustments, getAdjustmentById
	} = useHolding( { _id: holding_id, account_id: account_id } );
	const adjustment = useMemo( () => {
		const adjustment = getAdjustmentById( _id );
		return adjustment;
	}, [ holding ] );

	const { AdjustmentTypes } = useTypes();
	const [ stockSplit, merger, priceUpdate, amountUpdate, update ] = AdjustmentTypes;
	const type = useMemo( () => {
		// TODO: Hae aikasempi transaction ja adjustment
		// Vertaa niiden datea
		// Sen avulla katot tyypit ja samalla vois johonkin
		// useState priorPrice ja priorAmount tyylisiin tallentaa
		// aikasemmasta arvot
	}, [ adjustments, transactions ] );

	const saveAdjustment = useCallback( ( editedAdjustment: Adjustment ) => {
		const title = __( 'Save Adjustment' );
		const message = __( 'Are you sure?' );

		return new Promise( ( resolve, _ ) => {
			confirmation( {
				title,
				message,
				onAccept() {
					resolve( realm.write( () => {
						Object.assign( adjustment, { ...editedAdjustment } );
					} ) );
				}
			} );
		} );
	}, [ adjustment, holding ] );

	const removeAdjustment = useCallback( () => {
		const title = __( 'Remove Adjustment' );
		const message = __( 'Are you sure?' );

		return new Promise( ( resolve, _ ) => {
			confirmation( {
				title,
				message,
				onAccept() {
					resolve( realm.write( () => {
						const index = adjustments.findIndex( adjustment => {
							return adjustment._id.equals( _id );
						} );
						
						adjustments.remove( index );
					} ) );
				}
			} );
		} );
	}, [ adjustment, adjustments ] );

	return {
		adjustment, saveAdjustment, removeAdjustment,
		holding,
		type
	}
}
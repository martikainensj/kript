import { useEffect, useState } from "react"
import { Account } from "../models/Account";
import { Holding } from "../models/Holding";
import { Transaction } from "../models/Transaction";

export type SelectableType = 'Account' | 'Holding' | 'Transaction';
export type SelectableObject = {
		'Account': Account;
		'Holding': Holding;
		'Transaction': Transaction;
}

export const useSelector = () => {
	const [ shouldValidate, validate ] = useState({});
	const [ selectedType, setSelectedType ] = useState<SelectableType>();
	const [ selectedObjects, setSelectedObjects ] = useState<SelectableObject[SelectableType][]>([]);
	const [ isSelecting, setIsSelecting ] = useState<boolean>();

	const hasObject = ( object: SelectableObject[SelectableType] ) => {
		const hasObject = !! selectedObjects.find( selectedObject => {
			if ( ! selectedObject?.isValid() ) return false;

			return selectedObject._id.toString() === object._id.toString()
		});

		return hasObject;
	}

	const canSelect = ( type: SelectableType ) => {
		if ( selectedObjects.length === 0 ) {
			return true;
		}

		if ( type === selectedType ) {
			return true;
		}

		return false;
	}

	const select = <T extends SelectableType>( type: T, object: SelectableObject[T] ) => {
		if ( hasObject( object ) || ! canSelect( type )) {
			return;
		}

		if ( ! isSelecting ) {
			setSelectedType( type );
			setIsSelecting( true );
		}
			
		setSelectedObjects([
			...selectedObjects,
			object
		]);
	}

	const deselect = ( object: SelectableObject[SelectableType] ) => {
		if ( ! hasObject( object )) {
			return;
		}

		setSelectedObjects( selectedObjects.filter( selectedObject => selectedObject._id.toString() !== object._id.toString() ) );
	}

	useEffect(() => {
		if ( ! selectedObjects.length ) {
			setIsSelecting( false );
		}
	}, [selectedObjects]);

	useEffect( () => {
		setSelectedObjects( selectedObjects.filter( object => object?.isValid()));
	}, [ shouldValidate ]);
	
	return { isSelecting, selectedType, selectedObjects, select, deselect, canSelect, hasObject, validate }
}